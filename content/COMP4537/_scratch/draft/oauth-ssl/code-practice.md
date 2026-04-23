---
n: 5
id: oauth-ssl
title: "Trace the OAuth 2.0 authorization flow"
lang: js
tags: [OAuth, bearer-token, client-id, client-secret, HTTPS]
source: "Slide 11"
---

## Prompt

Trace the OAuth 2.0 flow for a user logging into ClientApp using Google credentials. Fill in the blanks: what does each numbered step transmit and what does each actor receive?

<svg viewBox="0 0 720 320" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;font-family:sans-serif;font-size:12px">
  <!-- Actors -->
  <rect x="10" y="20" width="100" height="36" rx="4" fill="#d4edda" stroke="#155724"/>
  <text x="60" y="43" text-anchor="middle" font-weight="bold">User/Browser</text>

  <rect x="300" y="20" width="100" height="36" rx="4" fill="#cce5ff" stroke="#004085"/>
  <text x="350" y="43" text-anchor="middle" font-weight="bold">ClientApp</text>

  <rect x="590" y="20" width="110" height="36" rx="4" fill="#fff3cd" stroke="#856404"/>
  <text x="645" y="43" text-anchor="middle" font-weight="bold">Google OAuth</text>

  <!-- Step 1: User clicks Login -->
  <line x1="110" y1="100" x2="300" y2="100" stroke="#333" marker-end="url(#arr)"/>
  <text x="205" y="95" text-anchor="middle">1. Click "Login with Google"</text>

  <!-- Step 2: Redirect to Google with client_id -->
  <line x1="400" y1="130" x2="590" y2="130" stroke="#333" marker-end="url(#arr)"/>
  <text x="495" y="125" text-anchor="middle">2. Redirect + client_id</text>

  <!-- Step 3: Google shows consent screen, user approves -->
  <line x1="590" y1="160" x2="110" y2="160" stroke="#333" marker-end="url(#arr)"/>
  <text x="350" y="155" text-anchor="middle">3. Consent screen → user approves</text>

  <!-- Step 4: Google sends bearer token back to ClientApp -->
  <line x1="590" y1="200" x2="400" y2="200" stroke="#e83e3e" marker-end="url(#arr2)" stroke-width="2"/>
  <text x="495" y="195" text-anchor="middle" fill="#e83e3e" font-weight="bold">4. Bearer token → ClientApp</text>

  <!-- Step 5: ClientApp uses token to access Google API -->
  <line x1="400" y1="240" x2="590" y2="240" stroke="#155724" marker-end="url(#arr3)" stroke-width="2"/>
  <text x="495" y="235" text-anchor="middle" fill="#155724" font-weight="bold">5. Future requests + bearer token</text>

  <defs>
    <marker id="arr" markerWidth="8" markerHeight="8" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#333"/></marker>
    <marker id="arr2" markerWidth="8" markerHeight="8" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#e83e3e"/></marker>
    <marker id="arr3" markerWidth="8" markerHeight="8" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#155724"/></marker>
  </defs>
</svg>

Questions:

1. What does ClientApp send to Google in step 2 to identify itself?
2. What does "bearer token" mean in terms of authorization?
3. What does the app owner do before step 1 can occur?

## Starter

```js
// Fill in the blanks — pseudo-code for the OAuth 2.0 flow

// BEFORE step 1: App owner registers at Google Developer Console
const CLIENT_ID = '___';      // given by Google during onboarding
const CLIENT_SECRET = '___';  // given by Google; keep server-side only

// Step 1-3: User initiates login (handled by redirect)
// ClientApp redirects user to:
const oauthUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${CLIENT_ID}&redirect_uri=___&scope=___`;

// Step 4: Google redirects back with bearer token
// ClientApp receives:
const bearerToken = req.query.___; // ??? what field?

// Step 5: ClientApp uses bearer token
const response = await fetch('https://www.googleapis.com/userinfo', {
  headers: { Authorization: `Bearer ${bearerToken}` },
});
```

## Solution

```js
// BEFORE step 1: App owner onboards at Google Developer Console
const CLIENT_ID = 'my-app-client-id';      // public identifier for the app
const CLIENT_SECRET = 'my-app-secret';     // private; never sent to browser

// Step 2: Redirect user to Google OAuth endpoint
const oauthUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${CLIENT_ID}&redirect_uri=https://myapp.com/callback&scope=profile email&response_type=code`;
// Browser redirects user there; Google shows consent screen

// Step 4: Google redirects back with an authorization code
// (simplified: in production OAuth uses authorization_code flow, not direct token)
const bearerToken = req.query.access_token; // or exchanged from auth code

// Step 5: ClientApp uses bearer token in Authorization header
const response = await fetch('https://www.googleapis.com/userinfo', {
  headers: { Authorization: `Bearer ${bearerToken}` },
});
// Anyone who holds this token is implicitly granted authorization
```

## Why

OAuth 2.0 lets ClientApp access user data on Google without the user ever giving ClientApp their Google password. The client ID is public (sent in the redirect URL); the client secret is private (never exposed to the browser). The bearer token is time-limited and possession-based — anyone who holds it gains access, so ClientApp must protect it (e.g., sign requests or store server-side). Common wrong approach: storing the client secret in frontend JavaScript — it would be visible to anyone inspecting the page source, allowing attackers to impersonate the app.
