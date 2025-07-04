import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Typography, AppBar, Toolbar, Container } from '@testwelbi/ui'

export const Route = createRootRoute({
  component: () => (
    <>
      <AppBar $position="static">
        <Toolbar>
          <Typography $variant="h6" style={{ flexGrow: 1, color: 'white' }}>
            TestWelbi
          </Typography>
          <Link to="/" style={{ color: 'white', marginRight: '20px', textDecoration: 'none' }}>
            Home
          </Link>
          <Link to="/about" style={{ color: 'white', textDecoration: 'none' }}>
            About
          </Link>
        </Toolbar>
      </AppBar>
      <Container $maxWidth="lg" $sx="mt-4">
        <Outlet />
      </Container>
      <TanStackRouterDevtools />
    </>
  ),
}) 