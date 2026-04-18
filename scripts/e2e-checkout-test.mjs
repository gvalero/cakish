/**
 * E2E Checkout Test — Cakish
 * Tests the full purchase flow: order page → Stripe checkout → success page
 * Uses Stripe test card 4242 4242 4242 4242
 */

import { chromium } from "playwright";

const SITE_URL = "https://cakish.pages.dev";
const TEST_CUSTOMER = {
  name: "E2E Test Customer",
  email: "e2etest@cakish.ie",
  date: "2026-06-15",
  note: "Automated E2E test — please ignore",
};

async function runTest() {
  console.log("🧪 Cakish E2E Checkout Test\n");

  const browser = await chromium.launch({
    channel: "msedge",
    headless: false,
    slowMo: 300,
  });

  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  try {
    // ── Step 1: Navigate to order page ──
    console.log("1️⃣  Navigating to order page...");
    await page.goto(`${SITE_URL}/order`, { waitUntil: "networkidle", timeout: 30000 });
    console.log("   ✓ Order page loaded");

    // ── Step 2: Select product (Strawberry Pavlova should be default) ──
    console.log("2️⃣  Checking product selection...");
    // The first product card should already be selected
    const productCards = await page.locator('[data-product-id]').count().catch(() => 0);
    // Try clicking the first product radio/button if visible
    const firstProduct = page.locator('fieldset').first().locator('button, label, [role="radio"]').first();
    if (await firstProduct.isVisible().catch(() => false)) {
      console.log("   Clicking first product option...");
      await firstProduct.click();
    }
    console.log("   ✓ Product selected");

    // ── Step 3: Select size (Medium) ──
    console.log("3️⃣  Selecting size...");
    // Try to find and click "Medium" size option
    const mediumSize = page.locator('text=Medium').first();
    if (await mediumSize.isVisible().catch(() => false)) {
      await mediumSize.click();
      console.log("   ✓ Medium size selected");
    } else {
      console.log("   ⚠ Could not find Medium option, using default");
    }

    // ── Step 4: Select filling (Dulce de Leche for surcharge test) ──
    console.log("4️⃣  Selecting filling...");
    const dulce = page.locator('text=Dulce de Leche').first();
    if (await dulce.isVisible().catch(() => false)) {
      await dulce.click();
      console.log("   ✓ Dulce de Leche selected (+€3)");
    }

    // ── Step 5: Check price display ──
    console.log("5️⃣  Checking price...");
    // Look for price text on the page
    const priceText = await page.locator('text=/€\\d+/').first().textContent().catch(() => "N/A");
    console.log(`   Price shown: ${priceText}`);

    // ── Step 6: Click "Proceed to Checkout" to open the drawer ──
    console.log("6️⃣  Opening checkout drawer...");
    const proceedBtn = page.locator('button:has-text("Proceed to Checkout")');
    await proceedBtn.scrollIntoViewIfNeeded();
    await proceedBtn.click();
    console.log("   ✓ Checkout drawer opened");
    await page.waitForTimeout(1000);

    // ── Step 7: Fill customer info ──
    console.log("7️⃣  Filling customer info...");

    // Name field
    const nameInput = page.locator('input[placeholder*="name" i], input[name*="name" i], input[id*="name" i]').first();
    if (await nameInput.isVisible().catch(() => false)) {
      await nameInput.fill(TEST_CUSTOMER.name);
      console.log("   ✓ Name entered");
    } else {
      console.log("   ⚠ Name field not found — trying text labels");
      const nameByLabel = page.locator('label:has-text("Name")').locator('..').locator('input').first();
      if (await nameByLabel.isVisible().catch(() => false)) {
        await nameByLabel.fill(TEST_CUSTOMER.name);
        console.log("   ✓ Name entered (via label)");
      }
    }

    // Email field
    const emailInput = page.locator('input[type="email"], input[placeholder*="email" i], input[name*="email" i]').first();
    if (await emailInput.isVisible().catch(() => false)) {
      await emailInput.fill(TEST_CUSTOMER.email);
      console.log("   ✓ Email entered");
    }

    // Collection date
    const dateInput = page.locator('input[type="date"], input[placeholder*="date" i], input[name*="date" i]').first();
    if (await dateInput.isVisible().catch(() => false)) {
      await dateInput.fill(TEST_CUSTOMER.date);
      console.log("   ✓ Collection date set");
    }

    // Optional note
    const noteInput = page.locator('textarea, input[placeholder*="note" i]').first();
    if (await noteInput.isVisible().catch(() => false)) {
      await noteInput.fill(TEST_CUSTOMER.note);
      console.log("   ✓ Note entered");
    }

    await page.waitForTimeout(500);

    // ── Step 8: Click the "Pay €XX.XX Securely" button ──
    console.log("8️⃣  Submitting payment...");
    // Dismiss any date picker overlay by clicking the drawer heading
    await page.locator('aside h2:has-text("Your order")').click();
    await page.waitForTimeout(500);
    // Find the pay button inside the drawer aside
    const submitBtn = page.locator('aside button.cakish-button:has-text("Pay")');
    await submitBtn.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    const btnText = await submitBtn.textContent();
    console.log(`   Clicking: "${btnText}"`);
    await submitBtn.click({ force: true });

    // ── Step 9: Wait for Stripe redirect ──
    console.log("9️⃣  Waiting for Stripe checkout redirect...");
    try {
      await page.waitForURL("**/checkout.stripe.com/**", { timeout: 15000 });
      console.log("   ✓ Redirected to Stripe Checkout!");
      console.log(`   URL: ${page.url()}`);
    } catch (e) {
      // Check if we got an error instead
      const errorText = await page.locator('[class*="error"], [role="alert"]').textContent().catch(() => "");
      if (errorText) {
        console.log(`   ❌ Error: ${errorText}`);
      } else {
        console.log(`   ❌ Did not redirect to Stripe. Current URL: ${page.url()}`);
      }
      // Take screenshot for debugging
      await page.screenshot({ path: "scripts/e2e-checkout-debug.png" });
      console.log("   📸 Screenshot saved to scripts/e2e-checkout-debug.png");
      throw new Error("Did not reach Stripe checkout");
    }

    // ── Step 10: Fill Stripe test card ──
    console.log("🔟  Filling Stripe test card details...");
    await page.waitForTimeout(3000); // Stripe checkout loads slowly

    // Email may be pre-filled, but fill if empty
    const stripeEmail = page.locator('input[name="email"], input[id="email"]').first();
    if (await stripeEmail.isVisible().catch(() => false)) {
      const val = await stripeEmail.inputValue().catch(() => "");
      if (!val) {
        await stripeEmail.fill(TEST_CUSTOMER.email);
        console.log("   ✓ Stripe email filled");
      } else {
        console.log(`   ✓ Stripe email pre-filled: ${val}`);
      }
    }

    // Card number — Stripe uses iframes for card fields
    const cardFrame = page.frameLocator('iframe[name*="privateStripeFrame"], iframe[title*="card"]').first();

    // Try the unified card input first
    const cardInput = cardFrame.locator('input[name="cardnumber"], input[placeholder*="card number" i]').first();
    if (await cardInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await cardInput.fill("4242424242424242");
      console.log("   ✓ Card number entered");
    } else {
      console.log("   ⚠ Card input not found in iframe, trying page-level...");
      const pageCard = page.locator('input[name="cardNumber"]').first();
      if (await pageCard.isVisible().catch(() => false)) {
        await pageCard.fill("4242424242424242");
      }
    }

    // Expiry
    const expiryInput = cardFrame.locator('input[name="exp-date"], input[placeholder*="MM" i]').first();
    if (await expiryInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expiryInput.fill("12/30");
      console.log("   ✓ Expiry entered");
    }

    // CVC
    const cvcInput = cardFrame.locator('input[name="cvc"], input[placeholder*="CVC" i]').first();
    if (await cvcInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await cvcInput.fill("123");
      console.log("   ✓ CVC entered");
    }

    // Cardholder name (if present)
    const nameOnCard = page.locator('input[name="billingName"], input[placeholder*="name on card" i]').first();
    if (await nameOnCard.isVisible().catch(() => false)) {
      await nameOnCard.fill(TEST_CUSTOMER.name);
      console.log("   ✓ Cardholder name entered");
    }

    await page.waitForTimeout(1000);

    // ── Step 11: Submit payment ──
    console.log("1️⃣1️⃣  Submitting Stripe payment...");
    const stripePay = page.locator('button[type="submit"], button:has-text("Pay")').first();
    if (await stripePay.isVisible().catch(() => false)) {
      const payText = await stripePay.textContent();
      console.log(`   Clicking: "${payText}"`);
      await stripePay.click();
    }

    // ── Step 12: Wait for success redirect ──
    console.log("1️⃣2️⃣  Waiting for success page...");
    try {
      await page.waitForURL("**/order/success/**", { timeout: 30000 });
      console.log("   ✓ Redirected to success page!");
      console.log(`   URL: ${page.url()}`);
    } catch {
      console.log(`   ⚠ Current URL: ${page.url()}`);
      await page.screenshot({ path: "scripts/e2e-success-debug.png" });
      console.log("   📸 Screenshot saved");
    }

    // ── Step 13: Verify success page content ──
    console.log("1️⃣3️⃣  Verifying success page...");
    await page.waitForTimeout(3000);
    const pageText = await page.textContent("body");

    const checks = {
      "Payment confirmed": /paid|confirmed|success|thank/i.test(pageText),
      "Customer email shown": pageText.includes(TEST_CUSTOMER.email),
      "Product name shown": /pavlova/i.test(pageText),
      "Order details visible": /filling|size|collection/i.test(pageText),
    };

    for (const [check, passed] of Object.entries(checks)) {
      console.log(`   ${passed ? "✓" : "✗"} ${check}`);
    }

    // Take final screenshot
    await page.screenshot({ path: "scripts/e2e-success-final.png" });
    console.log("\n📸 Final screenshot: scripts/e2e-success-final.png");

    const allPassed = Object.values(checks).every(Boolean);
    console.log(allPassed ? "\n✅ E2E TEST PASSED!" : "\n⚠️ Some checks failed — review above");

  } catch (err) {
    console.error(`\n❌ Test failed: ${err.message}`);
    await page.screenshot({ path: "scripts/e2e-error.png" }).catch(() => {});
    console.log("📸 Error screenshot: scripts/e2e-error.png");
  } finally {
    // Keep browser open for inspection
    console.log("\n🔍 Browser staying open for inspection. Close manually or press Ctrl+C.");
    await page.waitForTimeout(120000); // 2 min window
    await browser.close();
  }
}

runTest();
