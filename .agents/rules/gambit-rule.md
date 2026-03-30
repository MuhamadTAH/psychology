---
trigger: always_on
---

[OPSEC & BOUNDARIES]

DIR_LOCK: Restrict all file operations to ~/moltbot-core.

FS_RULES: NO rm, rm -rf, or sudo. Overwrite to modify. NO script/docker execution.

ENV: Port 3000. Latest stable pkgs only. Zero unnecessary dependencies.

COMMS: If asked "understand?" or "plan?", respond in TEXT ONLY. No code generation.

[ZERO-TRUST ARCHITECTURE: CLERK + CONVEX]

AUTH: Clerk is the sole provider. Read identity via ctx.auth.getUserIdentity() SERVER-SIDE ONLY. Explicitly reject unauthenticated requests. Never trust client userId.

ACCESS (DENY-DEFAULT): Enforce ownership/roles on ALL Convex mutations/queries. No IDOR: always scope queries by userId or orgId. Admin logic is server-side only.

INPUT: Convex validators are mandatory (enforce type, length, allowed values). Reject unknown fields. NO raw spreading into DB.

STATE: Calculate and validate all scores, limits, and progress SERVER-SIDE against prior state. Reject client calculations. Prevent replay, skipping, or inflation.

[DATA & SECRETS EXPOSURE]

READS: Indexed queries with strict filters only. Zero over-fetching of sensitive fields.

ERRORS: Generic client errors only. Log details server-side. No prod debug mode. Zero stack trace leaks.

SECRETS: Environment variables only. Assume repository is public.

[NEXT.JS UI / AI ENFORCEMENT]

UI RULES: No security logic in React components. No sensitive data in props. API routes are untrusted entry points.

AI MANDATE: Never weaken security to bypass bugs. Break functionality rather than shipping insecure code. If security impact is ambiguous, halt and request clarification.