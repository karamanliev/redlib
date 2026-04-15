# Cerebrum

> OpenWolf's learning memory. Updated automatically as the AI learns from interactions.
> Do not edit manually unless correcting an error.
> Last updated: 2026-04-15

## User Preferences

- Uses conductor/ensemble pattern via claude-tempo for coordinating multi-repo work
- Prefers building Docker images locally and pushing to GHCR rather than relying solely on CI
- Uses ArgoCD with selfHeal for GitOps deployments on Talos k8s
- Image tags use `sha-XXXXXXX` format (short git SHA)
- Prefers small stylistic changes that build on existing in-progress style commits instead of replacing them wholesale
- Prefers the comment score pill attached naturally to the thread line; avoid negative bottom offsets like `margin-bottom: -2px` when a cleaner layout works without them
- Prefers collapse auto-scroll only when the collapsed comment's score pill is off-screen; if the pill is already visible, avoid moving the viewport

## Key Learnings

- **Project:** redlib
- **Description:** > An alternative private front-end to Reddit, with its origins in [Libreddit](https://github.com/libreddit/libreddit).
- `compose.dev.yaml` uses `build: .` without specifying `Dockerfile.build`, so it resolves to `Dockerfile` and downloads the latest released binary instead of compiling the local checkout
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
- `templates/comment.html` already uses native `<details>` for comment collapse; extra click targets should toggle that same element instead of adding a separate collapse state
- `src/main.rs` hardcodes individual static asset routes; new files under `static/` 404 until they are explicitly registered with `app.at(...)`
- Duplicate listing cards in `templates/duplicates.html` need the same internal `.post_content` wrapper used by regular listing posts; without it, `post_footer` does not sit as the card's bottom row
- Feed listing posts in `templates/utils.html` work better on mobile when the score shares a row with the title and the thumbnail stacks beneath the text content instead of staying beside it
- Feed list cards should skip rendering `.post_thumbnail` entirely when `post.thumbnail.url` is empty; placeholder boxes look broken once thumbnails become full-width on mobile
- `post_score::before` should live in the base score styles, not only a mobile media query, otherwise desktop feed cards lose the vote arrow icon
- In feed title rows, the flexible width should be applied to a non-link wrapper rather than the `.post_title` anchor itself, or the entire leftover row becomes an oversized click target
- Firefox may wrap the arrow and digits in `.post_score` onto separate lines unless the score is explicitly `white-space: nowrap`

## Do-Not-Repeat

<!-- Mistakes made and corrected. Each entry prevents the same mistake recurring. -->
<!-- Format: [YYYY-MM-DD] Description of what went wrong and what to do instead. -->
- [2026-04-10] Don't use `kubectl set image` on ArgoCD-managed deployments with selfHeal — it gets reverted. Update the Git manifest instead.
- [2026-04-10] Don't use `git checkout --theirs` when you mean `--ours` in a merge. In merge context: --ours = current branch (HEAD), --theirs = branch being merged in.

## Decision Log

<!-- Significant technical decisions with rationale. Why X was chosen over Y. -->
- [2026-04-10] Adopted wreq+BoringSSL over our hyper-tls approach — BoringSSL emulates real browser TLS fingerprints (Chrome, Firefox, Android) which is the proper long-term fix for Fastly bot detection, whereas default OpenSSL fingerprints will eventually be detected too
- [2026-04-10] Referrer-Policy conditionally set based on analytics — no-referrer for privacy when analytics off, strict-origin-when-cross-origin when on (minimum needed for PostHog CSRF)
