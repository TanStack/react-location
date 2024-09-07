/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as PostsImport } from './routes/posts'
import { Route as PostsIndexImport } from './routes/posts.index'
import { Route as LayoutTestLayoutBImport } from './routes/_layout-test/layout-b'
import { Route as LayoutTestLayoutAImport } from './routes/_layout-test/layout-a'
import { Route as PostsPostIdRouteImport } from './routes/posts.$postId/route'
import { Route as PostsPostIdDeepImport } from './routes/posts_.$postId.deep'

// Create Virtual Routes

const LayoutTestLazyImport = createFileRoute('/_layout-test')()
const IndexLazyImport = createFileRoute('/')()
const LayoutTestLayoutBTestLazyImport = createFileRoute(
  '/_layout-test/layout-b/test',
)()

// Create/Update Routes

const LayoutTestLazyRoute = LayoutTestLazyImport.update({
  id: '/_layout-test',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/_layout-test.lazy').then((d) => d.Route))

const PostsRoute = PostsImport.update({
  path: '/posts',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/posts.lazy').then((d) => d.Route))

const IndexLazyRoute = IndexLazyImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/index.lazy').then((d) => d.Route))

const PostsIndexRoute = PostsIndexImport.update({
  path: '/',
  getParentRoute: () => PostsRoute,
} as any)

const LayoutTestLayoutBRoute = LayoutTestLayoutBImport.update({
  path: '/layout-b',
  getParentRoute: () => LayoutTestLazyRoute,
} as any)

const LayoutTestLayoutARoute = LayoutTestLayoutAImport.update({
  path: '/layout-a',
  getParentRoute: () => LayoutTestLazyRoute,
} as any)

const PostsPostIdRouteRoute = PostsPostIdRouteImport.update({
  path: '/$postId',
  getParentRoute: () => PostsRoute,
} as any).lazy(() => import('./routes/posts.$postId/lazy').then((d) => d.Route))

const LayoutTestLayoutBTestLazyRoute = LayoutTestLayoutBTestLazyImport.update({
  path: '/test',
  getParentRoute: () => LayoutTestLayoutBRoute,
} as any).lazy(() =>
  import('./routes/_layout-test/layout-b.test.lazy').then((d) => d.Route),
)

const PostsPostIdDeepRoute = PostsPostIdDeepImport.update({
  path: '/posts/$postId/deep',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/posts_.$postId.deep.lazy').then((d) => d.Route),
)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/posts': {
      id: '/posts'
      path: '/posts'
      fullPath: '/posts'
      preLoaderRoute: typeof PostsImport
      parentRoute: typeof rootRoute
    }
    '/_layout-test': {
      id: '/_layout-test'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof LayoutTestLazyImport
      parentRoute: typeof rootRoute
    }
    '/posts/$postId': {
      id: '/posts/$postId'
      path: '/$postId'
      fullPath: '/posts/$postId'
      preLoaderRoute: typeof PostsPostIdRouteImport
      parentRoute: typeof PostsImport
    }
    '/_layout-test/layout-a': {
      id: '/_layout-test/layout-a'
      path: '/layout-a'
      fullPath: '/layout-a'
      preLoaderRoute: typeof LayoutTestLayoutAImport
      parentRoute: typeof LayoutTestLazyImport
    }
    '/_layout-test/layout-b': {
      id: '/_layout-test/layout-b'
      path: '/layout-b'
      fullPath: '/layout-b'
      preLoaderRoute: typeof LayoutTestLayoutBImport
      parentRoute: typeof LayoutTestLazyImport
    }
    '/posts/': {
      id: '/posts/'
      path: '/'
      fullPath: '/posts/'
      preLoaderRoute: typeof PostsIndexImport
      parentRoute: typeof PostsImport
    }
    '/posts/$postId/deep': {
      id: '/posts/$postId/deep'
      path: '/posts/$postId/deep'
      fullPath: '/posts/$postId/deep'
      preLoaderRoute: typeof PostsPostIdDeepImport
      parentRoute: typeof rootRoute
    }
    '/_layout-test/layout-b/test': {
      id: '/_layout-test/layout-b/test'
      path: '/test'
      fullPath: '/layout-b/test'
      preLoaderRoute: typeof LayoutTestLayoutBTestLazyImport
      parentRoute: typeof LayoutTestLayoutBImport
    }
  }
}

// Create and export the route tree

interface PostsRouteChildren {
  PostsPostIdRouteRoute: typeof PostsPostIdRouteRoute
  PostsIndexRoute: typeof PostsIndexRoute
}

const PostsRouteChildren: PostsRouteChildren = {
  PostsPostIdRouteRoute: PostsPostIdRouteRoute,
  PostsIndexRoute: PostsIndexRoute,
}

const PostsRouteWithChildren = PostsRoute._addFileChildren(PostsRouteChildren)

interface LayoutTestLayoutBRouteChildren {
  LayoutTestLayoutBTestLazyRoute: typeof LayoutTestLayoutBTestLazyRoute
}

const LayoutTestLayoutBRouteChildren: LayoutTestLayoutBRouteChildren = {
  LayoutTestLayoutBTestLazyRoute: LayoutTestLayoutBTestLazyRoute,
}

const LayoutTestLayoutBRouteWithChildren =
  LayoutTestLayoutBRoute._addFileChildren(LayoutTestLayoutBRouteChildren)

interface LayoutTestLazyRouteChildren {
  LayoutTestLayoutARoute: typeof LayoutTestLayoutARoute
  LayoutTestLayoutBRoute: typeof LayoutTestLayoutBRouteWithChildren
}

const LayoutTestLazyRouteChildren: LayoutTestLazyRouteChildren = {
  LayoutTestLayoutARoute: LayoutTestLayoutARoute,
  LayoutTestLayoutBRoute: LayoutTestLayoutBRouteWithChildren,
}

const LayoutTestLazyRouteWithChildren = LayoutTestLazyRoute._addFileChildren(
  LayoutTestLazyRouteChildren,
)

export interface FileRoutesByFullPath {
  '/': typeof IndexLazyRoute
  '/posts': typeof PostsRouteWithChildren
  '': typeof LayoutTestLazyRouteWithChildren
  '/posts/$postId': typeof PostsPostIdRouteRoute
  '/layout-a': typeof LayoutTestLayoutARoute
  '/layout-b': typeof LayoutTestLayoutBRouteWithChildren
  '/posts/': typeof PostsIndexRoute
  '/posts/$postId/deep': typeof PostsPostIdDeepRoute
  '/layout-b/test': typeof LayoutTestLayoutBTestLazyRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexLazyRoute
  '': typeof LayoutTestLazyRouteWithChildren
  '/posts/$postId': typeof PostsPostIdRouteRoute
  '/layout-a': typeof LayoutTestLayoutARoute
  '/layout-b': typeof LayoutTestLayoutBRouteWithChildren
  '/posts': typeof PostsIndexRoute
  '/posts/$postId/deep': typeof PostsPostIdDeepRoute
  '/layout-b/test': typeof LayoutTestLayoutBTestLazyRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexLazyRoute
  '/posts': typeof PostsRouteWithChildren
  '/_layout-test': typeof LayoutTestLazyRouteWithChildren
  '/posts/$postId': typeof PostsPostIdRouteRoute
  '/_layout-test/layout-a': typeof LayoutTestLayoutARoute
  '/_layout-test/layout-b': typeof LayoutTestLayoutBRouteWithChildren
  '/posts/': typeof PostsIndexRoute
  '/posts/$postId/deep': typeof PostsPostIdDeepRoute
  '/_layout-test/layout-b/test': typeof LayoutTestLayoutBTestLazyRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/posts'
    | ''
    | '/posts/$postId'
    | '/layout-a'
    | '/layout-b'
    | '/posts/'
    | '/posts/$postId/deep'
    | '/layout-b/test'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | ''
    | '/posts/$postId'
    | '/layout-a'
    | '/layout-b'
    | '/posts'
    | '/posts/$postId/deep'
    | '/layout-b/test'
  id:
    | '/'
    | '/posts'
    | '/_layout-test'
    | '/posts/$postId'
    | '/_layout-test/layout-a'
    | '/_layout-test/layout-b'
    | '/posts/'
    | '/posts/$postId/deep'
    | '/_layout-test/layout-b/test'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexLazyRoute: typeof IndexLazyRoute
  PostsRoute: typeof PostsRouteWithChildren
  LayoutTestLazyRoute: typeof LayoutTestLazyRouteWithChildren
  PostsPostIdDeepRoute: typeof PostsPostIdDeepRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexLazyRoute: IndexLazyRoute,
  PostsRoute: PostsRouteWithChildren,
  LayoutTestLazyRoute: LayoutTestLazyRouteWithChildren,
  PostsPostIdDeepRoute: PostsPostIdDeepRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/posts",
        "/_layout-test",
        "/posts/$postId/deep"
      ]
    },
    "/": {
      "filePath": "index.lazy.tsx"
    },
    "/posts": {
      "filePath": "posts.tsx",
      "children": [
        "/posts/$postId",
        "/posts/"
      ]
    },
    "/_layout-test": {
      "filePath": "_layout-test.lazy.tsx",
      "children": [
        "/_layout-test/layout-a",
        "/_layout-test/layout-b"
      ]
    },
    "/posts/$postId": {
      "filePath": "posts.$postId/route.tsx",
      "parent": "/posts"
    },
    "/_layout-test/layout-a": {
      "filePath": "_layout-test/layout-a.tsx",
      "parent": "/_layout-test"
    },
    "/_layout-test/layout-b": {
      "filePath": "_layout-test/layout-b.tsx",
      "parent": "/_layout-test",
      "children": [
        "/_layout-test/layout-b/test"
      ]
    },
    "/posts/": {
      "filePath": "posts.index.tsx",
      "parent": "/posts"
    },
    "/posts/$postId/deep": {
      "filePath": "posts_.$postId.deep.tsx"
    },
    "/_layout-test/layout-b/test": {
      "filePath": "_layout-test/layout-b.test.lazy.tsx",
      "parent": "/_layout-test/layout-b"
    }
  }
}
ROUTE_MANIFEST_END */
