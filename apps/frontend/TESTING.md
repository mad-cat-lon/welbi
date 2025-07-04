## Unit tests
- All unit tests are stored in `apps/frontend/tests/unit`
- Follow the format `route.test.tsx` with one test file per route
- Run with `rushx test`
- Get coverage with `rushx test:coverage`
### Test harness
- `apps/frontend/tests/testUtils.tsx`
- Renders components in a test-friendly environment with `customRender`
- Set up environment before test with `setupTestEnv()`, with the route under test passed as a parameter (defaults to `/`)
- Mocks dependencies such `@tanstack/react-router`, `@tanstack/router-devtools`, etc.
## End-to-end tests (WIP!)
- `pnpm exec playwright test` or `test:e2e`
- Make sure to install all dependencies if prompted
- POMs are stored in `apps/frontend/tests/pages`
