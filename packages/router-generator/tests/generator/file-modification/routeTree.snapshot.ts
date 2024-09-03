/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as testInitiallyLazyImport } from './routes/(test)/initiallyLazy'
import { Route as testInitiallyEmptyImport } from './routes/(test)/initiallyEmpty'
import { Route as testFooImport } from './routes/(test)/foo'

// Create Virtual Routes

const testBarLazyImport = createFileRoute('/(test)/bar')()

// Create/Update Routes

const testBarLazyRoute = testBarLazyImport
  .update({
    path: '/bar',
    getParentRoute: () => rootRoute,
  } as any)
  .lazy(() => import('./routes/(test)/bar.lazy').then((d) => d.Route))

const testInitiallyLazyRoute = testInitiallyLazyImport.update({
  path: '/initiallyLazy',
  getParentRoute: () => rootRoute,
} as any)

const testInitiallyEmptyRoute = testInitiallyEmptyImport
  .update({
    path: '/initiallyEmpty',
    getParentRoute: () => rootRoute,
  } as any)
  .lazy(() =>
    import('./routes/(test)/initiallyEmpty.lazy').then((d) => d.Route),
  )

const testFooRoute = testFooImport.update({
  path: '/foo',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/(test)/foo': {
      id: '/foo'
      path: '/foo'
      fullPath: '/foo'
      preLoaderRoute: typeof testFooImport
      parentRoute: typeof rootRoute
    }
    '/(test)/initiallyEmpty': {
      id: '/initiallyEmpty'
      path: '/initiallyEmpty'
      fullPath: '/initiallyEmpty'
      preLoaderRoute: typeof testInitiallyEmptyImport
      parentRoute: typeof rootRoute
    }
    '/(test)/initiallyLazy': {
      id: '/initiallyLazy'
      path: '/initiallyLazy'
      fullPath: '/initiallyLazy'
      preLoaderRoute: typeof testInitiallyLazyImport
      parentRoute: typeof rootRoute
    }
    '/(test)/bar': {
      id: '/bar'
      path: '/bar'
      fullPath: '/bar'
      preLoaderRoute: typeof testBarLazyImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

interface FileRoutesByFullPath {
  '/foo': typeof testFooRoute
  '/initiallyEmpty': typeof testInitiallyEmptyRoute
  '/initiallyLazy': typeof testInitiallyLazyRoute
  '/bar': typeof testBarLazyRoute
}

interface FileRoutesByTo {
  '/foo': typeof testFooRoute
  '/initiallyEmpty': typeof testInitiallyEmptyRoute
  '/initiallyLazy': typeof testInitiallyLazyRoute
  '/bar': typeof testBarLazyRoute
}

interface FileRoutesById {
  '/foo': typeof testFooRoute
  '/initiallyEmpty': typeof testInitiallyEmptyRoute
  '/initiallyLazy': typeof testInitiallyLazyRoute
  '/bar': typeof testBarLazyRoute
}

interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/foo' | '/initiallyEmpty' | '/initiallyLazy' | '/bar'
  fileRoutesByTo: FileRoutesByTo
  to: '/foo' | '/initiallyEmpty' | '/initiallyLazy' | '/bar'
  id: '/foo' | '/initiallyEmpty' | '/initiallyLazy' | '/bar'
  fileRoutesById: FileRoutesById
}

interface RootRouteChildren {
  testFooRoute: typeof testFooRoute
  testInitiallyEmptyRoute: typeof testInitiallyEmptyRoute
  testInitiallyLazyRoute: typeof testInitiallyLazyRoute
  testBarLazyRoute: typeof testBarLazyRoute
}

const rootRouteChildren: RootRouteChildren = {
  testFooRoute: testFooRoute,
  testInitiallyEmptyRoute: testInitiallyEmptyRoute,
  testInitiallyLazyRoute: testInitiallyLazyRoute,
  testBarLazyRoute: testBarLazyRoute,
}

export const routeTree = rootRoute
  .addChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/foo",
        "/initiallyEmpty",
        "/initiallyLazy",
        "/bar"
      ]
    },
    "/foo": {
      "filePath": "(test)/foo.tsx"
    },
    "/initiallyEmpty": {
      "filePath": "(test)/initiallyEmpty.tsx"
    },
    "/initiallyLazy": {
      "filePath": "(test)/initiallyLazy.tsx"
    },
    "/bar": {
      "filePath": "(test)/bar.lazy.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
