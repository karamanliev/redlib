# Cerebrum

> OpenWolf's learning memory. Updated automatically as the AI learns from interactions.
> Do not edit manually unless correcting an error.
> Last updated: 2026-04-09

## User Preferences

- Uses conductor/ensemble pattern via claude-tempo for coordinating multi-repo work
- Prefers building Docker images locally and pushing to GHCR rather than relying solely on CI
- Uses ArgoCD with selfHeal for GitOps deployments on Talos k8s
- Image tags use `sha-XXXXXXX` format (short git SHA)

## Key Learnings

- **Project:** redlib
- **Description:** > An alternative private front-end to Reddit, with its origins in [Libreddit](https://github.com/libreddit/libreddit).
- Reddit blocks redlib via Fastly ML bot detection based on TLS fingerprints, not IP or rate limits
- wreq + BoringSSL (from Silvenga's PR #544) emulates real browser TLS fingerprints to evade detection
- PostHog session replay requires: /decide endpoint accessible, ingestion-sessionreplay service running, /s/ route to replay-capture
- Referrer-Policy: no-referrer breaks PostHog /decide (Django CSRF needs Referer header) — use strict-origin-when-cross-origin when analytics enabled
- disable_compression: true needed in PostHog JS init to prevent Cloudflare double-gzip
- data-cfasync="false" needed on PostHog script tags to prevent Cloudflare Rocket Loader interference
- test_generic_web_backend fails in GH Actions CI because Reddit blocks those IPs — marked #[ignore]
- Dockerfile.ubuntu (not Dockerfile) is needed for local building — includes cmake/libclang-dev for BoringSSL
- Dockerfile.build is used by GHA (ghcr.yml) for CI — Alpine-based, needs cmake/clang-dev/linux-headers for BoringSSL
- wreq/BoringSSL deps require Rust edition 2024 → minimum Rust 1.85
- ArgoCD selfHeal: true reverts manual kubectl changes — must update Git source of truth

## Do-Not-Repeat

<!-- Mistakes made and corrected. Each entry prevents the same mistake recurring. -->
<!-- Format: [YYYY-MM-DD] Description of what went wrong and what to do instead. -->
- [2026-04-10] Don't use `kubectl set image` on ArgoCD-managed deployments with selfHeal — it gets reverted. Update the Git manifest instead.
- [2026-04-10] Don't use `git checkout --theirs` when you mean `--ours` in a merge. In merge context: --ours = current branch (HEAD), --theirs = branch being merged in.

## Decision Log

<!-- Significant technical decisions with rationale. Why X was chosen over Y. -->
- [2026-04-10] Adopted wreq+BoringSSL over our hyper-tls approach — BoringSSL emulates real browser TLS fingerprints (Chrome, Firefox, Android) which is the proper long-term fix for Fastly bot detection, whereas default OpenSSL fingerprints will eventually be detected too
- [2026-04-10] Referrer-Policy conditionally set based on analytics — no-referrer for privacy when analytics off, strict-origin-when-cross-origin when on (minimum needed for PostHog CSRF)
