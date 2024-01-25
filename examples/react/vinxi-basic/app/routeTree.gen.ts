// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as HelloImport } from './routes/hello'
import { Route as IndexImport } from './routes/index'

// Create/Update Routes

const HelloRoute = HelloImport.update({
  path: '/hello',
  getParentRoute: () => rootRoute,
} as any).update({
  lazy: () => import('./routes/hello.lazy').then((d) => d.Route),
})

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/hello': {
      preLoaderRoute: typeof HelloImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([IndexRoute, HelloRoute])
