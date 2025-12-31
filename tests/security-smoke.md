## Security Smoke Checklist (run after auth changes)

These steps validate the auth/authorization guards we added. Run in two browsers: one signed in, one incognito/signed out.

1) **Unauthenticated redirect**  
   - In a logged-out/incognito window, visit `/dark-psychology` and `/dark-psychology/section/A`.  
   - Expect redirect to `/sign-in` and no Convex errors in the console.

2) **Signed-in lesson flow**  
   - Sign in with a normal user.  
   - Visit `/dark-psychology`, enter a section, start a lesson; confirm questions load and progress/XP update without errors.

3) **API access control**  
   - Logged out: call `api.lessons.getAllDarkPsychologyLessons` from the console (Convex client) — should return `[]` or throw “Not authenticated”.  
   - Logged in: same call returns lessons.  
   - Try a Dark Psychology mutation (e.g., `api.darkPsychology.saveNote`) with a different email than your session — should throw “Forbidden”.

4) **Analytics admin-only**  
   - From a non-admin account, call any `convex/analytics` query — should throw “Forbidden”.  
   - From `system@duolearn.com` (or any email in `ADMIN_EMAILS` env), the same call should succeed.

5) **Legacy auth disabled**  
   - Ensure no client code calls `convex/auth.ts` signup/signin; those mutations now throw “Email/password … is disabled”.

6) **Shop/Leagues/Weak areas guarded**  
   - Logged out: calls to `shop`, `leagues`, or `weakAreas` queries should reject as unauthenticated.  
   - Logged in: calls succeed for the current user only.

> Tip: if you want to automate, add a small Convex test harness to call the above with mocked identities and assert unauthenticated/foreign email calls fail and correct user succeeds.
