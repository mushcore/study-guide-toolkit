---
n: 4
id: public-private-keys
title: "Trace the Amir→Tom asymmetric signing sequence"
lang: js
tags: [asymmetric, public-key, private-key, signing, RSA]
source: "Slide 10, ISAQuiz11 Q9"
---

## Prompt

Amir wants to send a message to Tom that satisfies two conditions: (1) only Tom can read it, and (2) Tom can verify it came from Amir and was not tampered with. Both parties have each other's public keys.

The diagram below shows the double-envelope flow from Slide 10 (slides 7–8):

<svg viewBox="0 0 700 280" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;font-family:monospace;font-size:13px">
  <!-- Amir side -->
  <rect x="10" y="20" width="120" height="40" rx="4" fill="#e8f0fe" stroke="#4a6fa5"/>
  <text x="70" y="45" text-anchor="middle">Amir's message</text>
  <!-- Step 1: encrypt with Tom's public key -->
  <text x="160" y="45" fill="#555">1. Encrypt with Tom's public key</text>
  <rect x="310" y="20" width="130" height="40" rx="4" fill="#fff3cd" stroke="#856404"/>
  <text x="375" y="45" text-anchor="middle">Inner envelope</text>
  <text x="375" y="58" text-anchor="middle" font-size="10">(Tom's pubkey sealed)</text>
  <!-- Step 2: sign outer with Amir's private key -->
  <text x="160" y="110" fill="#555">2. Sign outer envelope with Amir's private key</text>
  <rect x="290" y="90" width="170" height="60" rx="4" fill="#d4edda" stroke="#155724"/>
  <text x="375" y="115" text-anchor="middle">Outer envelope</text>
  <text x="375" y="130" text-anchor="middle" font-size="10">(Amir's privkey sealed)</text>
  <text x="375" y="143" text-anchor="middle" font-size="10">contains inner envelope</text>
  <!-- Tom side -->
  <text x="490" y="45" fill="#333">Tom receives →</text>
  <text x="490" y="70" fill="#555">3. Open outer w/ Amir's PUBLIC key → confirms sender</text>
  <text x="490" y="90" fill="#555">4. Open inner w/ Tom's PRIVATE key → reads message</text>
</svg>

**Trace question:** In step 3, which key does Tom use and what does a successful open prove?

Fill in the four `/* key: ??? */` comments in the starter below with the correct key variable.

## Starter

```js
// Pseudocode — trace the key operations, not runnable crypto code
// Amir has: amir_private_key, amir_public_key, tom_public_key
// Tom has:  tom_private_key, tom_public_key, amir_public_key

// Amir sends a message:
const inner = encrypt(message, /* key: ??? */);
const outer = sign(inner,    /* key: ??? */);
send(outer); // Tom receives outer

// Tom receives and verifies:
const inner = verify(outer,  /* key: ??? */); // step 3: proves sender
const message = decrypt(inner, /* key: ??? */); // step 4: reads content
```

## Solution

```js
// Amir sends a message:
const inner = encrypt(message, tom_public_key);     // only Tom's private key can open
const outer = sign(inner,      amir_private_key);   // anyone with Amir's public key can verify
send(outer);

// Tom receives and verifies:
const inner   = verify(outer,  amir_public_key);    // proves outer came from Amir
const message = decrypt(inner, tom_private_key);    // proves message was for Tom only
```

## Why

Encryption for confidentiality uses the RECEIVER's public key — so only the receiver's private key can open it. Signing for authenticity uses the SENDER's private key — so anyone with the sender's public key can verify the signature. These are opposite key directions. Confusing them is the most common wrong answer on ISAQuiz11 Q9: "verify uses the receiver's private key" (wrong — that's decryption, not verification). The double-envelope pattern satisfies both properties simultaneously: the inner envelope ensures only Tom can read it; the outer envelope ensures Tom knows it came from Amir.
