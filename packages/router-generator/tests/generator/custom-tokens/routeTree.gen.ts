/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as PostsR0ut3Import } from './routes/posts/_r0ut3_'
import { Route as BlogR0ut3Import } from './routes/blog/_r0ut3_'
import { Route as R1nd3xImport } from './routes/_1nd3x'
import { Route as Posts1nd3xImport } from './routes/posts/_1nd3x'
import { Route as Blog1nd3xImport } from './routes/blog/_1nd3x'
import { Route as BlogSlugImport } from './routes/blog/$slug'
import { Route as PostsPostId1nd3xImport } from './routes/posts/$postId/_1nd3x'
import { Route as PostsPostIdDeepImport } from './routes/posts/$postId/deep'

// Create/Update Routes

const PostsR0ut3Route = PostsR0ut3Import.update({
  path: '/posts',
  getParentRoute: () => rootRoute,
} as any)

const BlogR0ut3Route = BlogR0ut3Import.update({
  path: '/blog',
  getParentRoute: () => rootRoute,
} as any)

const R1nd3xRoute = R1nd3xImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const Posts1nd3xRoute = Posts1nd3xImport.update({
  path: '/',
  getParentRoute: () => PostsR0ut3Route,
} as any)

const Blog1nd3xRoute = Blog1nd3xImport.update({
  path: '/',
  getParentRoute: () => BlogR0ut3Route,
} as any)

const BlogSlugRoute = BlogSlugImport.update({
  path: '/$slug',
  getParentRoute: () => BlogR0ut3Route,
} as any)

const PostsPostId1nd3xRoute = PostsPostId1nd3xImport.update({
  path: '/$postId/',
  getParentRoute: () => PostsR0ut3Route,
} as any)

const PostsPostIdDeepRoute = PostsPostIdDeepImport.update({
  path: '/$postId/deep',
  getParentRoute: () => PostsR0ut3Route,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof R1nd3xImport
      parentRoute: typeof rootRoute
    }
    '/blog': {
      id: '/blog'
      path: '/blog'
      fullPath: '/blog'
      preLoaderRoute: typeof BlogR0ut3Import
      parentRoute: typeof rootRoute
    }
    '/posts': {
      id: '/posts'
      path: '/posts'
      fullPath: '/posts'
      preLoaderRoute: typeof PostsR0ut3Import
      parentRoute: typeof rootRoute
    }
    '/blog/$slug': {
      id: '/blog/$slug'
      path: '/$slug'
      fullPath: '/blog/$slug'
      preLoaderRoute: typeof BlogSlugImport
      parentRoute: typeof BlogR0ut3Import
    }
    '/blog/': {
      id: '/blog/'
      path: '/'
      fullPath: '/blog/'
      preLoaderRoute: typeof Blog1nd3xImport
      parentRoute: typeof BlogR0ut3Import
    }
    '/posts/': {
      id: '/posts/'
      path: '/'
      fullPath: '/posts/'
      preLoaderRoute: typeof Posts1nd3xImport
      parentRoute: typeof PostsR0ut3Import
    }
    '/posts/$postId/deep': {
      id: '/posts/$postId/deep'
      path: '/$postId/deep'
      fullPath: '/posts/$postId/deep'
      preLoaderRoute: typeof PostsPostIdDeepImport
      parentRoute: typeof PostsR0ut3Import
    }
    '/posts/$postId/': {
      id: '/posts/$postId/'
      path: '/$postId'
      fullPath: '/posts/$postId'
      preLoaderRoute: typeof PostsPostId1nd3xImport
      parentRoute: typeof PostsR0ut3Import
    }
  }
}

// Create and export the route tree

interface BlogR0ut3RouteChildren {
  BlogSlugRoute: typeof BlogSlugRoute
  Blog1nd3xRoute: typeof Blog1nd3xRoute
}

const BlogR0ut3RouteChildren: BlogR0ut3RouteChildren = {
  BlogSlugRoute: BlogSlugRoute,
  Blog1nd3xRoute: Blog1nd3xRoute,
}

const BlogR0ut3RouteWithChildren = BlogR0ut3Route._addFileChildren(
  BlogR0ut3RouteChildren,
)

interface PostsR0ut3RouteChildren {
  Posts1nd3xRoute: typeof Posts1nd3xRoute
  PostsPostIdDeepRoute: typeof PostsPostIdDeepRoute
  PostsPostId1nd3xRoute: typeof PostsPostId1nd3xRoute
}

const PostsR0ut3RouteChildren: PostsR0ut3RouteChildren = {
  Posts1nd3xRoute: Posts1nd3xRoute,
  PostsPostIdDeepRoute: PostsPostIdDeepRoute,
  PostsPostId1nd3xRoute: PostsPostId1nd3xRoute,
}

const PostsR0ut3RouteWithChildren = PostsR0ut3Route._addFileChildren(
  PostsR0ut3RouteChildren,
)

interface FileRoutesByFullPath {
  '/': typeof R1nd3xRoute
  '/blog': typeof BlogR0ut3RouteWithChildren
  '/posts': typeof PostsR0ut3RouteWithChildren
  '/blog/$slug': typeof BlogSlugRoute
  '/blog/': typeof Blog1nd3xRoute
  '/posts/': typeof Posts1nd3xRoute
  '/posts/$postId/deep': typeof PostsPostIdDeepRoute
  '/posts/$postId': typeof PostsPostId1nd3xRoute
}

interface FileRoutesByTo {
  '/': typeof R1nd3xRoute
  '/blog/$slug': typeof BlogSlugRoute
  '/blog': typeof Blog1nd3xRoute
  '/posts': typeof Posts1nd3xRoute
  '/posts/$postId/deep': typeof PostsPostIdDeepRoute
  '/posts/$postId': typeof PostsPostId1nd3xRoute
}

interface FileRoutesById {
  '/': typeof R1nd3xRoute
  '/blog': typeof BlogR0ut3RouteWithChildren
  '/posts': typeof PostsR0ut3RouteWithChildren
  '/blog/$slug': typeof BlogSlugRoute
  '/blog/': typeof Blog1nd3xRoute
  '/posts/': typeof Posts1nd3xRoute
  '/posts/$postId/deep': typeof PostsPostIdDeepRoute
  '/posts/$postId/': typeof PostsPostId1nd3xRoute
}

interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/blog'
    | '/posts'
    | '/blog/$slug'
    | '/blog/'
    | '/posts/'
    | '/posts/$postId/deep'
    | '/posts/$postId'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/blog/$slug'
    | '/blog'
    | '/posts'
    | '/posts/$postId/deep'
    | '/posts/$postId'
  id:
    | '/'
    | '/blog'
    | '/posts'
    | '/blog/$slug'
    | '/blog/'
    | '/posts/'
    | '/posts/$postId/deep'
    | '/posts/$postId/'
  fileRoutesById: FileRoutesById
}

interface RootRouteChildren {
  R1nd3xRoute: typeof R1nd3xRoute
  BlogR0ut3Route: typeof BlogR0ut3RouteWithChildren
  PostsR0ut3Route: typeof PostsR0ut3RouteWithChildren
}

const rootRouteChildren: RootRouteChildren = {
  R1nd3xRoute: R1nd3xRoute,
  BlogR0ut3Route: BlogR0ut3RouteWithChildren,
  PostsR0ut3Route: PostsR0ut3RouteWithChildren,
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
        "/blog",
        "/posts"
      ]
    },
    "/": {
      "filePath": "_1nd3x.tsx"
    },
    "/blog": {
      "filePath": "blog/_r0ut3_.tsx",
      "children": [
        "/blog/$slug",
        "/blog/"
      ]
    },
    "/posts": {
      "filePath": "posts/_r0ut3_.tsx",
      "children": [
        "/posts/",
        "/posts/$postId/deep",
        "/posts/$postId/"
      ]
    },
    "/blog/$slug": {
      "filePath": "blog/$slug.tsx",
      "parent": "/blog"
    },
    "/blog/": {
      "filePath": "blog/_1nd3x.tsx",
      "parent": "/blog"
    },
    "/posts/": {
      "filePath": "posts/_1nd3x.tsx",
      "parent": "/posts"
    },
    "/posts/$postId/deep": {
      "filePath": "posts/$postId/deep.tsx",
      "parent": "/posts"
    },
    "/posts/$postId/": {
      "filePath": "posts/$postId/_1nd3x.tsx",
      "parent": "/posts"
    }
  }
}
ROUTE_MANIFEST_END */
