import { createRemoteJWKSet, jwtVerify } from "jose";
import {
  deliverPendingNotifications,
  getOrderById,
  listOrders,
  updateOrder,
  validateOrderUpdate,
} from "./order-management.js";

const encoder = new TextEncoder();
const ADMIN_COOKIE = "cakish_admin";
const CSRF_COOKIE = "cakish_csrf";
const accessKeySets = new Map();

function parseCookies(request) {
  const cookies = {};
  for (const entry of (request.headers.get("Cookie") || "").split(";")) {
    const separator = entry.indexOf("=");
    if (separator > 0) {
      cookies[entry.slice(0, separator).trim()] = entry.slice(separator + 1).trim();
    }
  }
  return cookies;
}

function base64UrlEncode(value) {
  return btoa(value).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function base64UrlDecode(value) {
  const unpadded = value.replaceAll("-", "+").replaceAll("_", "/");
  const normalized = unpadded.padEnd(Math.ceil(unpadded.length / 4) * 4, "=");
  return atob(normalized);
}

async function hmac(secret, value) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return base64UrlEncode(String.fromCharCode(...new Uint8Array(
    await crypto.subtle.sign("HMAC", key, encoder.encode(value)),
  )));
}

function constantTimeEqual(left, right) {
  const a = encoder.encode(left || "");
  const b = encoder.encode(right || "");
  let difference = a.length ^ b.length;
  const length = Math.max(a.length, b.length);
  for (let index = 0; index < length; index += 1) {
    difference |= (a[index % a.length] || 0) ^ (b[index % b.length] || 0);
  }
  return difference === 0;
}

function allowedAccessEmails(env) {
  return (typeof env.ADMIN_ALLOWED_EMAILS === "string" ? env.ADMIN_ALLOWED_EMAILS : "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

function accessConfiguration(env) {
  const teamDomain = typeof env.ACCESS_TEAM_DOMAIN === "string"
    ? env.ACCESS_TEAM_DOMAIN.trim().toLowerCase()
    : "";
  const audience = typeof env.ACCESS_AUD === "string" ? env.ACCESS_AUD.trim() : "";
  const emails = allowedAccessEmails(env);
  if (
    !/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.cloudflareaccess\.com$/.test(teamDomain) ||
    !audience ||
    emails.length === 0 ||
    emails.some((email) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
  ) return null;
  return {
    issuer: `https://${teamDomain}`,
    audience,
    emails,
    teamDomain,
  };
}

function remoteAccessKeySet(teamDomain) {
  let keySet = accessKeySets.get(teamDomain);
  if (!keySet) {
    keySet = createRemoteJWKSet(
      new URL(`https://${teamDomain}/cdn-cgi/access/certs`),
    );
    accessKeySets.set(teamDomain, keySet);
  }
  return keySet;
}

async function verifiedAccessIdentity(assertion, configuration, keySet) {
  if (!assertion) return null;
  try {
    const { payload } = await jwtVerify(
      assertion,
      keySet || remoteAccessKeySet(configuration.teamDomain),
      {
        algorithms: ["RS256"],
        issuer: configuration.issuer,
        audience: configuration.audience,
        requiredClaims: ["exp", "iss", "aud", "email"],
      },
    );
    const exactAudience = payload.aud === configuration.audience ||
      (Array.isArray(payload.aud) &&
        payload.aud.length === 1 &&
        payload.aud[0] === configuration.audience);
    const identity = typeof payload.email === "string"
      ? payload.email.trim().toLowerCase()
      : "";
    if (!exactAudience || !configuration.emails.includes(identity)) return null;
    return identity;
  } catch {
    return null;
  }
}

async function createSession(secret, identity, now = Date.now()) {
  const payload = base64UrlEncode(JSON.stringify({
    identity,
    expires: now + (8 * 60 * 60 * 1000),
    csrf: crypto.randomUUID(),
  }));
  return `${payload}.${await hmac(secret, payload)}`;
}

async function readSession(secret, value, now = Date.now()) {
  try {
    const [payload, signature] = value.split(".", 2);
    if (!payload || !signature || !constantTimeEqual(await hmac(secret, payload), signature)) return null;
    const session = JSON.parse(base64UrlDecode(payload));
    if (
      typeof session.identity !== "string" ||
      typeof session.csrf !== "string" ||
      !Number.isFinite(session.expires) ||
      session.expires < now
    ) return null;
    return session;
  } catch {
    return null;
  }
}

export async function authenticateAdmin(request, env, accessKeySet) {
  const accessConfig = accessConfiguration(env);
  const accessIdentity = accessConfig
    ? await verifiedAccessIdentity(
      request.headers.get("Cf-Access-Jwt-Assertion"),
      accessConfig,
      accessKeySet,
    )
    : null;
  if (accessIdentity) {
    return {
      allowed: true,
      configured: true,
      mode: "access",
      identity: accessIdentity,
      csrf: parseCookies(request)[CSRF_COOKIE] || null,
    };
  }

  if (env.ADMIN_API_SECRET) {
    const authorization = request.headers.get("Authorization") || "";
    const prefix = "Bearer ";
    if (
      authorization.startsWith(prefix) &&
      constantTimeEqual(authorization.slice(prefix.length), env.ADMIN_API_SECRET)
    ) {
      return {
        allowed: true,
        configured: true,
        mode: "bearer",
        identity: "bearer-admin",
        csrf: null,
      };
    }
    const session = await readSession(
      env.ADMIN_API_SECRET,
      parseCookies(request)[ADMIN_COOKIE] || "",
    );
    if (session) {
      return {
        allowed: true,
        configured: true,
        mode: "cookie",
        identity: session.identity,
        csrf: session.csrf,
      };
    }
  }

  return {
    allowed: false,
    configured: Boolean(
      env.ACCESS_TEAM_DOMAIN ||
      env.ACCESS_AUD ||
      env.ADMIN_ALLOWED_EMAILS ||
      env.ADMIN_API_SECRET
    ),
    mode: null,
  };
}

export function requireCsrf(request, auth) {
  if (auth.mode === "bearer") return true;
  const supplied = request.headers.get("X-CSRF-Token") || "";
  return Boolean(auth.csrf && constantTimeEqual(supplied, auth.csrf));
}

export function validateRetryBody(body) {
  if (body === null || body === undefined || Object.keys(body).length === 0) {
    return ["baker", "customer"];
  }
  if (
    typeof body !== "object" ||
    Array.isArray(body) ||
    Object.keys(body).some((key) => key !== "recipients") ||
    !Array.isArray(body.recipients) ||
    body.recipients.length < 1 ||
    body.recipients.length > 2
  ) {
    throw new RangeError("Invalid retry request");
  }
  const recipients = [...new Set(body.recipients)];
  if (recipients.some((recipient) => !["baker", "customer"].includes(recipient))) {
    throw new RangeError("Invalid notification recipient");
  }
  return recipients;
}

function secureHeaders(contentType, nonce) {
  const headers = new Headers({
    "Content-Type": contentType,
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
    "X-Frame-Options": "DENY",
  });
  if (nonce) {
    headers.set(
      "Content-Security-Policy",
      `default-src 'none'; script-src 'nonce-${nonce}'; style-src 'nonce-${nonce}'; connect-src 'self'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'`,
    );
  }
  return headers;
}

function adminJson(value, status = 200) {
  return Response.json(value, { status, headers: secureHeaders("application/json; charset=utf-8") });
}

function loginPage(status = 401, configured = true) {
  const nonce = crypto.randomUUID();
  const message = configured
    ? "Enter the configured admin secret. It is exchanged for a secure, short-lived cookie."
    : "Admin access is not configured.";
  return new Response(`<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width">
<title>Cakish admin sign in</title><style nonce="${nonce}">
body{font:16px system-ui;background:#f7f1e8;color:#292521;display:grid;place-items:center;min-height:100vh;margin:0}
main{background:white;border:1px solid #d9cdbd;padding:2rem;max-width:28rem;width:calc(100% - 4rem)}
label,input,button{display:block;width:100%;box-sizing:border-box}input,button{padding:.8rem;margin-top:.5rem}
button{margin-top:1rem;background:#292521;color:white;border:0}p{line-height:1.5}
</style></head><body><main><h1>Cakish orders</h1><p>${message}</p>
${configured ? '<form method="post" action="/admin/login"><label>Admin secret<input name="secret" type="password" required autocomplete="current-password"></label><button type="submit">Sign in</button></form>' : ""}
</main></body></html>`, { status, headers: secureHeaders("text/html; charset=utf-8", nonce) });
}

function dashboardPage(csrf) {
  const nonce = crypto.randomUUID();
  return new Response(`<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width">
<meta name="csrf-token" content="${csrf}"><title>Cakish orders</title>
<style nonce="${nonce}">
:root{font-family:system-ui;color:#292521;background:#f7f1e8}body{margin:0}header{background:#292521;color:white;padding:1rem 2rem}
main{max-width:1100px;margin:auto;padding:1rem}.grid{display:grid;grid-template-columns:minmax(18rem,1fr) minmax(20rem,1.4fr);gap:1rem}
.panel{background:white;border:1px solid #d9cdbd;padding:1rem}.order{width:100%;text-align:left;padding:.8rem;background:white;border:0;border-bottom:1px solid #eee;cursor:pointer}
.order:hover{background:#fff8ed}.muted{color:#70675e}.row{display:flex;justify-content:space-between;gap:1rem}.field{margin:.7rem 0}
label{display:block;font-weight:600}select,textarea,button{font:inherit;padding:.55rem}textarea{width:100%;box-sizing:border-box;min-height:7rem}
button{cursor:pointer}.primary{background:#292521;color:white;border:0}.danger{color:#8b1c1c}.badge{padding:.15rem .4rem;background:#eee;border-radius:.25rem}
dl{display:grid;grid-template-columns:9rem 1fr;gap:.45rem;margin:0}dt{font-weight:600}dd{margin:0;overflow-wrap:anywhere}
@media(max-width:760px){.grid{grid-template-columns:1fr}dl{grid-template-columns:1fr}header{padding:1rem}}
</style></head><body><header><h1>Cakish order management</h1></header><main>
<p id="message" role="status"></p><div class="grid"><section class="panel"><div class="row"><h2>Orders</h2><button id="refresh">Refresh</button></div>
<div id="orders"></div><button id="more" hidden>Load more</button></section>
<section class="panel"><h2>Order detail</h2><div id="detail" class="muted">Select an order.</div></section></div></main>
<script nonce="${nonce}">
const csrf=document.querySelector('meta[name="csrf-token"]').content;
const orders=document.getElementById("orders"),detail=document.getElementById("detail"),message=document.getElementById("message"),more=document.getElementById("more");
let cursor=null, selected=null;
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
async function api(path,options={}){options.credentials="same-origin";options.headers={...(options.headers||{}),"X-CSRF-Token":csrf};
 const response=await fetch(path,options);const data=await response.json();if(!response.ok)throw new Error(data.error||"Request failed");return data}
async function load(reset=false){try{if(reset){cursor=null;orders.textContent=""}const data=await api("/admin/api/orders?limit=25"+(cursor?"&cursor="+encodeURIComponent(cursor):""));
 data.orders.forEach(order=>{const button=document.createElement("button");button.className="order";button.innerHTML="<strong>"+esc(order.customer_name)+"</strong><br><span>"+esc(order.product)+" - "+esc(order.collection_date)+"</span><br><span class=muted>"+esc(order.fulfillment_status)+" / "+esc(order.payment_status)+"</span>";
 button.onclick=()=>show(order.id);orders.appendChild(button)});cursor=data.nextCursor;more.hidden=!cursor}catch(error){message.textContent=error.message}}
async function show(id){try{selected=id;const order=await api("/admin/api/orders/"+id);detail.innerHTML=
 "<dl>"+["stripe_session_id","customer_name","customer_email","collection_date","product","size","filling","finish","topper","quantity","customer_note","amount_total","currency","payment_status","fulfillment_status","internal_notes","baker_notification_status","baker_notification_attempts","baker_notification_last_attempt_at","baker_notification_error","customer_notification_status","customer_notification_attempts","customer_notification_last_attempt_at","customer_notification_error","created_at","updated_at"].map(k=>"<dt>"+esc(k.replaceAll("_"," "))+"</dt><dd>"+esc(order[k])+"</dd>").join("")+"</dl>"+
 '<form id="update"><div class="field"><label>Status<select name="fulfillmentStatus">'+["new","confirmed","baking","ready","collected","cancelled"].map(s=>'<option '+(order.fulfillment_status===s?"selected":"")+">"+s+"</option>").join("")+'</select></label></div>'+
 '<div class="field"><label>Internal notes<textarea name="internalNotes" maxlength="2000">'+esc(order.internal_notes)+'</textarea></label></div><button class="primary">Save</button></form>'+
 '<p><button id="retry">Retry pending/failed notifications</button></p>';
 document.getElementById("update").onsubmit=save;document.getElementById("retry").onclick=retry}catch(error){message.textContent=error.message}}
async function save(event){event.preventDefault();const form=new FormData(event.target);try{await api("/admin/api/orders/"+selected,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({fulfillmentStatus:form.get("fulfillmentStatus"),internalNotes:form.get("internalNotes")})});message.textContent="Order saved.";await show(selected);await load(true)}catch(error){message.textContent=error.message}}
async function retry(){try{const result=await api("/admin/api/orders/"+selected+"/retry",{method:"POST",headers:{"Content-Type":"application/json"},body:"{}"});message.textContent="Notification result: "+JSON.stringify(result.outcomes);await show(selected)}catch(error){message.textContent=error.message}}
document.getElementById("refresh").onclick=()=>load(true);more.onclick=()=>load();load(true);
</script></body></html>`, { headers: secureHeaders("text/html; charset=utf-8", nonce) });
}

async function readJson(request, maximum = 4096) {
  const text = await request.text();
  if (text.length > maximum) throw new RangeError("Request body too large");
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    throw new RangeError("Invalid JSON");
  }
}

function numericId(value) {
  const id = Number(value);
  if (!Number.isSafeInteger(id) || id < 1) throw new RangeError("Invalid order ID");
  return id;
}

export async function handleAdmin(request, env, url) {
  if (!url.pathname.startsWith("/admin")) return null;

  if (request.method === "POST" && url.pathname === "/admin/login") {
    if (!env.ADMIN_API_SECRET) return loginPage(503, false);
    const text = await request.text();
    if (text.length > 4096) return loginPage(400);
    const supplied = new URLSearchParams(text).get("secret") || "";
    if (!constantTimeEqual(supplied, env.ADMIN_API_SECRET)) return loginPage(401);
    const session = await createSession(env.ADMIN_API_SECRET, "secret-admin");
    return new Response(null, {
      status: 303,
      headers: {
        Location: "/admin",
        "Set-Cookie": `${ADMIN_COOKIE}=${session}; Path=/admin; HttpOnly; Secure; SameSite=Strict; Max-Age=28800`,
        "Cache-Control": "no-store",
      },
    });
  }

  const auth = await authenticateAdmin(request, env);
  if (!auth.allowed) {
    if (url.pathname === "/admin" && request.method === "GET" && env.ADMIN_API_SECRET) {
      return loginPage(401);
    }
    return url.pathname.startsWith("/admin/api/")
      ? adminJson({ error: auth.configured ? "Unauthorized" : "Admin access is not configured" }, auth.configured ? 401 : 503)
      : loginPage(auth.configured ? 401 : 503, auth.configured);
  }
  if (!env.DB) return adminJson({ error: "Order database is not configured" }, 503);

  let csrf = auth.csrf;
  const responseHeaders = new Headers();
  if (auth.mode === "access" && !csrf) {
    csrf = crypto.randomUUID();
    responseHeaders.set(
      "Set-Cookie",
      `${CSRF_COOKIE}=${csrf}; Path=/admin; HttpOnly; Secure; SameSite=Strict; Max-Age=28800`,
    );
  }
  if (request.method === "GET" && url.pathname === "/admin") {
    const response = dashboardPage(csrf || "");
    for (const [key, value] of responseHeaders) response.headers.set(key, value);
    return response;
  }

  if (!["GET", "HEAD"].includes(request.method) && !requireCsrf(request, { ...auth, csrf })) {
    return adminJson({ error: "Invalid CSRF token" }, 403);
  }

  try {
    if (request.method === "GET" && url.pathname === "/admin/api/orders") {
      return adminJson(await listOrders(env.DB, {
        limit: url.searchParams.get("limit"),
        cursor: url.searchParams.get("cursor"),
      }));
    }
    const detailMatch = url.pathname.match(/^\/admin\/api\/orders\/(\d+)$/);
    if (detailMatch && request.method === "GET") {
      const order = await getOrderById(env.DB, numericId(detailMatch[1]));
      return order ? adminJson(order) : adminJson({ error: "Order not found" }, 404);
    }
    if (detailMatch && request.method === "PATCH") {
      const order = await updateOrder(
        env.DB,
        numericId(detailMatch[1]),
        validateOrderUpdate(await readJson(request)),
      );
      return order ? adminJson(order) : adminJson({ error: "Order not found" }, 404);
    }
    const retryMatch = url.pathname.match(/^\/admin\/api\/orders\/(\d+)\/retry$/);
    if (retryMatch && request.method === "POST") {
      const id = numericId(retryMatch[1]);
      if (!await getOrderById(env.DB, id)) return adminJson({ error: "Order not found" }, 404);
      const recipients = validateRetryBody(await readJson(request));
      const outcomes = await deliverPendingNotifications(env.DB, env, id, { recipients });
      return adminJson({ outcomes });
    }
  } catch (error) {
    if (error instanceof RangeError) return adminJson({ error: error.message }, 400);
    console.error(JSON.stringify({ event: "admin_request_failed", path: url.pathname }));
    return adminJson({ error: "Admin request failed" }, 500);
  }
  return adminJson({ error: "Not found" }, 404);
}
