//
export {
  createHistory,
  createBrowserHistory,
  createHashHistory,
  createMemoryHistory,
  type BlockerFn,
  type HistoryLocation,
  type RouterHistory,
  type ParsedPath,
} from '@tanstack/history'
export { default as invariant } from 'tiny-invariant'
export { default as warning } from 'tiny-warning'
export * from './awaited'
export * from './defer'
export * from './CatchBoundary'
export * from './fileRoute'
export * from './history'
export * from './lazyRouteComponent'
export {
  useLinkProps,
  createLink,
  Link,
  type CleanPath,
  type Split,
  type ParsePathParams,
  type Join,
  type Last,
  type RemoveTrailingSlashes,
  type RemoveLeadingSlashes,
  type SearchPaths,
  type SearchRelativePathAutoComplete,
  type RelativeToParentPathAutoComplete,
  type RelativeToCurrentPathAutoComplete,
  type AbsolutePathAutoComplete,
  type RelativeToPathAutoComplete,
  type NavigateOptions,
  type ToOptions,
  type ToMaskOptions,
  type ToSubOptions,
  type ResolveRoute,
  type ParamOptions,
  type SearchParamOptions,
  type PathParamOptions,
  type ActiveOptions,
  type LinkOptions,
  type CheckPath,
  type CheckPathError,
  type ResolveRelativePath,
  type UseLinkPropsOptions,
  type ActiveLinkOptions,
  type LinkProps,
  type LinkComponent,
} from './link'
export { type ParsedLocation } from './location'
export {
  matchContext,
  Matches,
  Match,
  Outlet,
  useMatchRoute,
  MatchRoute,
  useMatch,
  useMatches,
  useParentMatches,
  useChildMatches,
  useLoaderDeps,
  useLoaderData,
  isServerSideError,
  defaultDeserializeError,
  type RouteMatch,
  type AnyRouteMatch,
  type MatchRouteOptions,
  type UseMatchRouteOptions,
  type MakeMatchRouteOptions,
} from './Matches'
export {
  joinPaths,
  cleanPath,
  trimPathLeft,
  trimPathRight,
  trimPath,
  resolvePath,
  parsePathname,
  interpolatePath,
  matchPathname,
  removeBasepath,
  matchByPath,
  type Segment,
} from './path'
export { encode, decode } from './qss'
export {
  redirect,
  isRedirect,
  type AnyRedirect,
  type Redirect,
  type ResolvedRedirect,
} from './redirects'
export {
  rootRouteId,
  RouteApi,
  getRouteApi,
  Route,
  createRoute,
  RootRoute,
  rootRouteWithContext,
  createRootRoute,
  createRootRouteWithContext,
  createRouteMask,
  NotFoundRoute,
  type RootRouteId,
  type AnyPathParams,
  type SearchSchemaInput,
  type AnySearchSchema,
  type AnyContext,
  type RouteContext,
  type PreloadableObj,
  type RoutePathOptions,
  type StaticDataRouteOption,
  type RoutePathOptionsIntersection,
  type RouteOptions,
  type ParamsFallback,
  type FileBaseRouteOptions,
  type BaseRouteOptions,
  type UpdatableRouteOptions,
  type UpdatableStaticRouteOption,
  type MetaDescriptor,
  type RouteLinkEntry,
  type ParseParamsOption,
  type ParseParamsFn,
  type SearchSchemaValidator,
  type SearchSchemaValidatorObj,
  type SearchSchemaValidatorFn,
  type RouteLoaderFn,
  type LoaderFnContext,
  type SearchFilter,
  type ResolveId,
  type InferFullSearchSchema,
  type InferFullSearchSchemaInput,
  type ResolveFullSearchSchema,
  type ResolveFullSearchSchemaInput,
  type AnyRoute,
  type MergeFromFromParent,
  type ResolveAllParams,
  type RouteConstraints,
  type AnyRootRoute,
  type RootSearchSchema,
  type ResolveFullPath,
  type RouteMask,
  type ErrorRouteProps,
  type ErrorComponentProps,
  type NotFoundRouteProps,
  type ReactNode,
  type SyncRouteComponent,
  type AsyncRouteComponent,
  type RouteComponent,
  type ErrorRouteComponent,
  type NotFoundRouteComponent,
} from './route'
export {
  type ParseRoute,
  type RoutesById,
  type RouteById,
  type RouteIds,
  type RoutesByPath,
  type RouteByPath,
  type RoutePaths,
  type RoutePathsAutoComplete,
  type FullSearchSchema,
  type AllParams,
} from './routeInfo'
export {
  componentTypes,
  createRouter,
  Router,
  lazyFn,
  SearchParamError,
  PathParamError,
  getInitialRouterState,
  defaultSerializeError,
  type Register,
  type AnyRouter,
  type RegisteredRouter,
  type HydrationCtx,
  type RouterContextOptions,
  type RouterOptions,
  type RouterTransformer,
  type RouterErrorSerializer,
  type RouterState,
  type ListenerFn,
  type BuildNextOptions,
  type DehydratedRouterState,
  type DehydratedRouteMatch,
  type DehydratedRouter,
  type RouterConstructorOptions,
  type RouterEvents,
  type RouterEvent,
} from './router'
export {
  RouterProvider,
  getRouteMatch,
  type RouterProps,
  type CommitLocationOptions,
  type MatchLocation,
  type NavigateFn,
  type BuildLocationFn,
  type InjectedHtmlEntry,
} from './RouterProvider'
export {
  useScrollRestoration,
  useElementScrollRestoration,
  ScrollRestoration,
  type ScrollRestorationOptions,
} from './scroll-restoration'
export {
  defaultParseSearch,
  defaultStringifySearch,
  parseSearchWith,
  stringifySearchWith,
  type SearchSerializer,
  type SearchParser,
} from './searchParams'
export { useBlocker, Block } from './useBlocker'
export { useNavigate, Navigate, type UseNavigateResult } from './useNavigate'
export { useParams } from './useParams'
export { useSearch } from './useSearch'
export {
  getRouterContext, // SSR
} from './routerContext'
export { useRouteContext } from './useRouteContext'
export { useRouter } from './useRouter'
export { useRouterState } from './useRouterState'
export {
  escapeJSON, // SSR
  useLayoutEffect, // SSR
} from './utils'
export {
  notFound,
  isNotFound,
  CatchNotFound,
  DefaultGlobalNotFound,
  type NotFoundError,
} from './not-found'
