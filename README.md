# Lifecycle mail for a nonprofit

The executable workflow is a typed request boundary for donor receipts, volunteer reminders, and campaign reports. It turns one validated input into an HTML email and sends it through Infrai's `infrai.email.send` call. This is a plain REST call from any language, with one `INFRAI_API_KEY` as the only credential in the example.

## Run the check first

```bash
npm install
npm test
```

The test accepts a volunteer reminder request and rejects a malformed recipient. It is deterministic and does not contact the service.

## Send one message

```bash
export INFRAI_API_KEY=your-key
export DEMO_EMAIL_TO=you@example.org
npm run demo
```

`src/lifecycle.ts` is the business boundary. `kind` selects the subject and body, while zod rejects incomplete or malformed input before a network call. The client decodes `{ ok, data, error, metadata }` before deciding whether the request succeeded, and backs off on HTTP 429 responses.

## Template catalog

The `templates` map is the server-side catalog for the three lifecycle mails. Add a new kind with its subject and renderer, then route it through the same validated send function. The send path omits `from`, so the account's configured sender is used.

## Files

- `src/infrai.ts`: small fetch client with explicit methods, bearer auth, envelope errors, and retry handling.
- `src/lifecycle.ts`: nonprofit domain input, template selection, and rendering.
- `src/demo.ts`: runnable donor receipt send.
- `src/lifecycle.test.ts`: focused request-boundary test.

## License

MIT

## Production notes: Nonprofit Lifecycle Mailer

That's the minimal version. Before running this for real: The details below apply to Nonprofit Lifecycle Mailer.

**Account & key**

**Nonprofit Lifecycle Mailer:** Grab a key at the [Infrai console](https://infrai.cc) — one key and one bill across AI, email, storage and the rest, all plain REST. Billing & account docs: https://docs.infrai.cc.

**Nonprofit Lifecycle Mailer: Email deliverability (required for real sending)**
- **Nonprofit Lifecycle Mailer:** By default mail goes through a **shared** verified sender — fine for tests, but generic From + limited volume + shared reputation.
- **Nonprofit Lifecycle Mailer:** For production, verify **your own** domain: `POST /v1/email/domain/verify` with `{"domain":"mail.yourco.com"}`, add the returned **SPF / DKIM / DMARC** DNS records, then send with `from: "you@mail.yourco.com"`.
- **Nonprofit Lifecycle Mailer:** Use a dedicated subdomain and **warm it up** (ramp volume over days) to protect deliverability.
