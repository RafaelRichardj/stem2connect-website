# Certificate verification

The public page verifies encrypted, digitally signed records using a public key. A random 128-bit ID is the key to finding and decrypting a record. Anyone who has the ID can read that record, so share IDs only with the recipient and people they authorize. Do not put ID lists, names, private keys, or certificates in this public repository. The system verifies the issuer's record; it does not establish the presenter's identity or independently verify attendance.

## Issuing (Node.js 20+)

The signing key and private issuance journal live outside this repository under `~/.local/share/stem2connect-verifier/`. Keep that folder private and make a secure backup. Anyone with the private key and the ability to publish can issue records. Losing it means the current issuing identity cannot issue further records. Never commit or upload the private key or private journal.

For an existing installation, do not run `init` again and do not replace `verify/public-key.json`. To issue an authorized certificate from the repository root:

```
node tools/certificates/issuer.mjs issue --name "Recipient Name" --event "Event or certificate title" --date YYYY-MM-DD
```

The printed ID is case-sensitive. Put it on the certificate and retain it securely. The record is not public or usable until its encrypted JSON is deployed with the site. Command-line arguments may be saved in your shell history or visible to other processes on the computer; use a trusted computer. No certificate file is uploaded by this script.

To bind the exact exported original PNG to its record, so a verifier can optionally compare an uploaded file locally in their browser:

```
node tools/certificates/issuer.mjs bind --id ID --file /path/to/original.png
```

The file stays on the computer; only its encrypted fingerprint is published. Re-exports, edits, or recompression change the fingerprint. For a revoked record:

```
node tools/certificates/issuer.mjs revoke --id ID
```

Deploy the changed record for binding or revocation to take effect. Until the deployment has propagated, the previous state may still be served. The page does not send uploaded files or the raw ID to the server. HTTPS is required for browser cryptography (localhost also works for development).

`node tools/certificates/test.mjs` exercises valid, missing, tampered and revoked records. Production use also requires testing the deployed page with a real record and confirming that a changed PNG fails the exact-file check. For a new organization instance only, `init` creates a signing key and public key; it refuses to overwrite an existing key.
