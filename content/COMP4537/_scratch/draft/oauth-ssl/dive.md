---
id: oauth-ssl
title: "OAuth 2.0 and SSL/TLS — flow, tokens, and HTTPS"
pillar: tech
priority: high
source: "Slide 11"
bloom_levels: [understand, apply]
related: [public-private-keys, jwt, httponly-cookies]
---

A user visits ClientApp and clicks "Login with Google." ClientApp never sees their Google password. Thirty seconds later the user is logged in and ClientApp is reading their profile. OAuth 2.0 and SSL/TLS are the two mechanisms making this work.

## SSL/TLS: automatic encryption for HTTPS

TLS (Transport Layer Security) is the current protocol. SSL (Secure Sockets Layer) is its deprecated predecessor — you will still see "SSL" used loosely to mean TLS. When a browser opens an `https://` URL, it runs a TLS handshake before any application data moves.

The TLS handshake does two things:

- **Key exchange** — browser and server agree on a shared session key. The server's SSL/TLS certificate carries the server's public key; the browser uses it to securely transmit key material that only the server's private key can decrypt.
- **Encrypted channel** — all data exchanged after the handshake is encrypted and decrypted automatically. Your application code does not implement this.

HTTPS = HTTP over TLS. The certificate in the handshake proves the server's identity and enables the key exchange.

## OAuth 2.0 flow

| Step | Actor | Action | Result |
|------|-------|--------|--------|
| 0 — Onboard | App owner | Registers ClientApp at Google Developer Console; specifies required scopes | Google issues **client ID** (public) and **client secret** (private) |
| 1 — Login click | User/Browser | Clicks "Login with Google" in ClientApp | — |
| 2 — Redirect | ClientApp | Redirects browser to Google OAuth 2.0 endpoint with client ID + scope | — |
| 3 — Consent | Google + User | Google shows consent screen; user clicks Allow | — |
| 4 — Token issued | Google | Generates bearer token; redirects browser back to ClientApp's redirect URI | ClientApp receives bearer token |
| 5 — API access | ClientApp | Sends bearer token in `Authorization` header on each request to Google | Google returns requested user data |

## Bearer tokens: possession equals authorization

Anyone who holds this token is implicitly granted authorization. The bearer model means no additional proof of identity is required — holding the token is sufficient to make authorized requests.

Two security consequences follow directly:

1. **Time-limited** — bearer tokens expire (for example, after 6 months). Expiry limits the window of exposure if a token leaks.
2. **Must be protected** — ClientApp should never expose the bearer token in frontend JavaScript, logs, or URLs. ClientApp signs outgoing requests using its private key and encrypts with Google's public key to protect the token in transit.

**Example**

During onboarding (step 0), Google creates two distinct credentials for ClientApp:
- **Client ID** (`my-app-client-id`) — included in redirect URLs, visible to anyone inspecting network traffic. This is intentional.
- **Client secret** (`my-app-secret`) — stored server-side only. The client secret is separate from the bearer token the user later grants. Never confuse the two: the client secret identifies the app; the bearer token authorizes access to a specific user's data.

## Why ClientApp delegates to Google

ClientApp does not store or verify Google passwords. It does not run its own authentication system. Instead, it accepts Google's verdict: if Google issues a bearer token after the user approves, the user is authenticated. ClientApp gains scoped user data (name, email, contacts — whatever the user approved) without touching credentials directly.

This is delegation: ClientApp hands the authentication problem to Google and receives a time-limited, scoped token in return.

**Note**

This explanation covers the simplified OAuth 2.0 flow as taught in the course. The full OAuth 2.0 protocol includes additional steps the course does not cover: the authorization code exchange (the server trades a short-lived code for a token, keeping the token server-side), PKCE (Proof Key for Code Exchange, which prevents code interception), and refresh tokens (for obtaining new bearer tokens after expiry). In production, you use an OAuth 2.0 library rather than implementing the flow manually.

**Takeaway:** SSL/TLS encrypts the transport channel automatically — your code does not implement it. OAuth 2.0 delegates user authentication to Google: the app owner registers once (getting client ID and client secret), users approve a consent screen, and Google issues a time-limited bearer token. Anyone who holds the token is authorized, so the token must be kept private.
