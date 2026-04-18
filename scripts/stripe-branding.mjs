#!/usr/bin/env node
/**
 * Stripe branding setup for Cakish.
 *
 * Two-phase approach:
 *   Phase 1 (API): Upload logo + icon files to Stripe
 *   Phase 2 (Playwright): Open Dashboard, wait for login, apply branding
 *
 * Usage:
 *   node scripts/stripe-branding.mjs <STRIPE_SECRET_KEY>
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const STRIPE_KEY = process.argv[2] || process.env.STRIPE_SECRET_KEY;
if (!STRIPE_KEY) {
  console.error("Usage: node scripts/stripe-branding.mjs <STRIPE_SECRET_KEY>");
  process.exit(1);
}

const LOGO_PATH = resolve(ROOT, "public/images/cakish-logo.png");
const ICON_PATH = resolve(ROOT, "app/icon.png");

const BRAND = {
  primary_color: "#b8956a",
  secondary_color: "#d8a7a7",
  business_name: "Cakish",
  support_email: "hello@cakish.ie",
  support_url: "https://cakish.ie",
  support_phone: "+353 83 446 2295",
};

async function stripeRequest(path, options = {}) {
  const url = `https://api.stripe.com/v1${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${STRIPE_KEY}`,
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Stripe ${path}: ${data.error?.message}`);
  return data;
}

async function uploadFile(filePath, purpose) {
  const fileData = readFileSync(filePath);
  const fileName = filePath.split(/[\\/]/).pop();
  const formData = new FormData();
  formData.append("purpose", purpose);
  formData.append("file", new Blob([fileData]), fileName);

  console.log(`  Uploading ${fileName} (purpose: ${purpose})...`);
  const res = await fetch("https://files.stripe.com/v1/files", {
    method: "POST",
    headers: { Authorization: `Bearer ${STRIPE_KEY}` },
    body: formData,
  });
  const result = await res.json();
  if (!res.ok) throw new Error(`Upload: ${result.error?.message}`);
  console.log(`  ✓ Uploaded → ${result.id} (${result.size} bytes)`);
  return result.id;
}

async function main() {
  console.log("🎂 Cakish — Stripe Branding Setup\n");

  // Phase 1: API — upload files + get account info
  console.log("Phase 1: API uploads\n");

  console.log("1. Checking account...");
  const account = await stripeRequest("/account");
  const mode = STRIPE_KEY.startsWith("sk_live") ? "LIVE" : "TEST";
  console.log(`   Account: ${account.id} (${account.business_profile?.name || "no name"})`);
  console.log(`   Mode: ${mode}\n`);

  console.log("2. Uploading logo...");
  const logoId = await uploadFile(LOGO_PATH, "business_logo");

  console.log("\n3. Uploading icon...");
  const iconId = await uploadFile(ICON_PATH, "business_icon");

  // Phase 2: Playwright — Dashboard branding
  console.log("\n\nPhase 2: Dashboard branding via Playwright\n");

  const dashboardBase = mode === "LIVE"
    ? "https://dashboard.stripe.com"
    : "https://dashboard.stripe.com/test";

  const pw = await import("playwright");

  console.log("Opening Stripe Dashboard in Edge...\n");
  const browser = await pw.chromium.launch({
    headless: false,
    channel: "msedge",
  });
  const ctx = await browser.newContext();
  const page = await ctx.newPage();

  // Navigate to branding settings
  await page.goto(`${dashboardBase}/settings/branding`);

  // Wait for login — user may need to authenticate
  console.log("⏳ Log in with: valerogian@gmail.com");
  console.log("   Script will continue automatically once you're in.\n");

  // Poll until we're on a dashboard page (user has logged in)
  const maxWait = Date.now() + 180000; // 3 minutes
  while (Date.now() < maxWait) {
    const url = page.url();
    if (url.includes("dashboard.stripe.com") && !url.includes("/login") && !url.includes("/sessions")) {
      break;
    }
    await page.waitForTimeout(2000);
  }
  
  // Navigate to branding page
  await page.goto(`${dashboardBase}/settings/branding`);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(3000);
  console.log("✓ On Branding settings page\n");

  // Give the page a moment to fully render
  await page.waitForTimeout(2000);

  // Fill in brand color
  console.log("4. Setting brand color...");
  try {
    // Look for color input field
    const colorInput = page.locator('input[aria-label*="color" i], input[placeholder*="color" i], input[name*="color" i]').first();
    if (await colorInput.isVisible({ timeout: 3000 })) {
      await colorInput.clear();
      await colorInput.fill(BRAND.primary_color);
      console.log(`   ✓ Set primary color to ${BRAND.primary_color}`);
    } else {
      console.log("   ⚠ Color input not found — set manually to", BRAND.primary_color);
    }
  } catch {
    console.log("   ⚠ Could not auto-set color — set manually to", BRAND.primary_color);
  }

  // Try to find and click save if available
  console.log("\n5. Looking for Save button...");
  try {
    const saveBtn = page.locator('button:has-text("Save"), button[type="submit"]').first();
    if (await saveBtn.isVisible({ timeout: 3000 })) {
      await saveBtn.click();
      console.log("   ✓ Clicked Save");
      await page.waitForTimeout(2000);
    }
  } catch {
    console.log("   ⚠ Save button not found — save manually");
  }

  console.log("\n📋 Manual steps (if anything wasn't auto-filled):");
  console.log(`   Logo file ID: ${logoId}`);
  console.log(`   Icon file ID: ${iconId}`);
  console.log(`   Primary color: ${BRAND.primary_color}`);
  console.log(`   Accent color: ${BRAND.secondary_color}`);
  console.log(`\n   Business name: ${BRAND.business_name}`);
  console.log(`   Support email: ${BRAND.support_email}`);
  console.log(`   Support phone: ${BRAND.support_phone}`);
  console.log(`   Support URL: ${BRAND.support_url}`);

  console.log("\n⏳ Browser will stay open for 5 minutes for manual adjustments.");
  console.log("   Close the browser when done, or press Ctrl+C to exit.\n");

  // Keep browser open for manual work
  await page.waitForTimeout(300000).catch(() => {});
  await browser.close();

  console.log("✅ Done!");
}

main().catch((err) => {
  console.error("\n❌ Error:", err.message);
  process.exit(1);
});
