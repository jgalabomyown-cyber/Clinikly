# TODO - Fix auth folder errors

## Steps
- [ ] Fix `app/(auth)/login/page.tsx`:
  - [ ] Import `supabase` from `@/lib/supabase`
  - [ ] Add `email` + `password` state
  - [ ] Wire inputs to state
  - [ ] Make submit button trigger `handleLogin`
- [ ] Fix `app/(auth)/signup/page.tsx`:
  - [ ] Import `supabase` from `@/lib/supabase`
  - [ ] Use `form.email` + `form.password` in signup handler
  - [ ] Make submit button trigger `handleSignup`
- [ ] Run `npm run lint`
- [ ] Run `npm run build`

