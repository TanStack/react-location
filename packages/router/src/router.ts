import { Store } from '@tanstack/store'
import invariant from 'tiny-invariant'

//

import { GetFrameworkGeneric } from './frameworks'

import {
  createBrowserHistory,
  createMemoryHistory,
  RouterHistory,
} from './history'
import {
  LinkInfo,
  LinkOptions,
  NavigateOptions,
  ResolveRelativePath,
  ToOptions,
  ValidFromPath,
} from './link'
import {
  cleanPath,
  interpolatePath,
  joinPaths,
  matchPathname,
  resolvePath,
  trimPath,
} from './path'
import {
  AnyContext,
  AnyPathParams,
  AnyRoute,
  AnySearchSchema,
  LoaderContext,
  RootRoute,
  Route,
  SearchFilter,
} from './route'
import { AnyRoutesInfo, RoutesById, RoutesInfo } from './routeInfo'
import { AnyRouteMatch, RouteMatch, RouteMatchStore } from './routeMatch'
import { defaultParseSearch, defaultStringifySearch } from './searchParams'
import {
  functionalUpdate,
  last,
  NoInfer,
  partialDeepEqual,
  pick,
  PickAsRequired,
  replaceEqualDeep,
  Timeout,
  Updater,
} from './utils'

export interface Register {
  // router: Router
}

export type AnyRouter = Router<any, any>

export type RegisteredRouter = Register extends {
  router: Router<infer TRoute, infer TRoutesInfo>
}
  ? Router<TRoute, TRoutesInfo>
  : Router

export type RegisteredRoutesInfo = Register extends {
  router: Router<infer TRoute, infer TRoutesInfo>
}
  ? TRoutesInfo
  : AnyRoutesInfo

export interface LocationState {}

export interface ParsedLocation<
  TSearchObj extends AnySearchSchema = {},
  TState extends LocationState = LocationState,
> {
  href: string
  pathname: string
  search: TSearchObj
  searchStr: string
  state: TState
  hash: string
  key?: string
}

export interface FromLocation {
  pathname: string
  search?: unknown
  key?: string
  hash?: string
}

export type SearchSerializer = (searchObj: Record<string, any>) => string
export type SearchParser = (searchStr: string) => Record<string, any>
export type FilterRoutesFn = <TRoute extends AnyRoute>(
  routes: TRoute[],
) => TRoute[]

type RouterContextOptions<TRouteTree extends AnyRoute> =
  AnyContext extends TRouteTree['__types']['routerContext']
    ? {
        context?: TRouteTree['__types']['routerContext']
      }
    : {
        context: TRouteTree['__types']['routerContext']
      }

export interface RouterOptions<TRouteTree extends AnyRoute> {
  history?: RouterHistory
  stringifySearch?: SearchSerializer
  parseSearch?: SearchParser
  filterRoutes?: FilterRoutesFn
  defaultPreload?: false | 'intent'
  defaultPreloadDelay?: number
  defaultComponent?: GetFrameworkGeneric<'Component'>
  defaultErrorComponent?: GetFrameworkGeneric<'ErrorComponent'>
  defaultPendingComponent?: GetFrameworkGeneric<'Component'>
  defaultLoaderMaxAge?: number
  defaultLoaderGcMaxAge?: number
  caseSensitive?: boolean
  routeTree?: TRouteTree
  basepath?: string
  Router?: (router: AnyRouter) => void
  createRoute?: (opts: { route: AnyRoute; router: AnyRouter }) => void
  loadComponent?: (
    component: GetFrameworkGeneric<'Component'>,
  ) => Promise<GetFrameworkGeneric<'Component'>>
  onRouteChange?: () => void
  fetchServerDataFn?: FetchServerDataFn
  context?: TRouteTree['__types']['routerContext']
}

type FetchServerDataFn = (ctx: {
  router: AnyRouter
  routeMatch: RouteMatch
}) => Promise<any>

export interface LoaderState<
  TFullSearchSchema extends AnySearchSchema = {},
  TAllParams extends AnyPathParams = {},
> {
  loadedAt: number
  loaderContext: LoaderContext<TFullSearchSchema, TAllParams>
}

export interface RouterStore<
  TRoutesInfo extends AnyRoutesInfo = AnyRoutesInfo,
  TState extends LocationState = LocationState,
> {
  status: 'idle' | 'pending'
  latestLocation: ParsedLocation<TRoutesInfo['fullSearchSchema'], TState>
  currentMatches: RouteMatch<TRoutesInfo, TRoutesInfo['routeIntersection']>[]
  currentLocation: ParsedLocation<TRoutesInfo['fullSearchSchema'], TState>
  pendingMatches?: RouteMatch<TRoutesInfo, TRoutesInfo['routeIntersection']>[]
  pendingLocation?: ParsedLocation<TRoutesInfo['fullSearchSchema'], TState>
  lastUpdated: number
}

export type ListenerFn = () => void

export interface BuildNextOptions {
  to?: string | number | null
  params?: true | Updater<unknown>
  search?: true | Updater<unknown>
  hash?: true | Updater<string>
  state?: LocationState
  key?: string
  from?: string
  fromCurrent?: boolean
  __preSearchFilters?: SearchFilter<any>[]
  __postSearchFilters?: SearchFilter<any>[]
}

export type MatchCacheEntry = {
  gc: number
  match: RouteMatch
}

export interface MatchLocation {
  to?: string | number | null
  fuzzy?: boolean
  caseSensitive?: boolean
  from?: string
  fromCurrent?: boolean
}

export interface MatchRouteOptions {
  pending?: boolean
  caseSensitive?: boolean
  includeSearch?: boolean
  fuzzy?: boolean
}

type LinkCurrentTargetElement = {
  preloadTimeout?: null | ReturnType<typeof setTimeout>
}

export interface DehydratedRouterState
  extends Pick<
    RouterStore,
    'status' | 'latestLocation' | 'currentLocation' | 'lastUpdated'
  > {
  currentMatches: DehydratedRouteMatch[]
}

export interface DehydratedRouter {
  state: DehydratedRouterState
}

export type MatchCache = Record<string, MatchCacheEntry>

interface DehydratedRouteMatch {
  id: string
  state: Pick<RouteMatchStore<any, any>, 'status'>
}

export interface RouterContext {}

export const defaultFetchServerDataFn: FetchServerDataFn = async ({
  router,
  routeMatch,
}) => {
  const next = router.buildNext({
    to: '.',
    search: (d: any) => ({
      ...(d ?? {}),
      __data: {
        matchId: routeMatch.id,
      },
    }),
  })

  const res = await fetch(next.href, {
    method: 'GET',
    signal: routeMatch.abortController.signal,
  })

  if (res.ok) {
    return res.json()
  }

  throw new Error('Failed to fetch match data')
}

export class Router<
  TRouteTree extends AnyRoute = RootRoute,
  TRoutesInfo extends AnyRoutesInfo = RoutesInfo<TRouteTree>,
> {
  types!: {
    // Super secret internal stuff
    RootRoute: TRouteTree
    RoutesInfo: TRoutesInfo
  }

  options: PickAsRequired<
    Omit<RouterOptions<TRouteTree>, 'context'>,
    'stringifySearch' | 'parseSearch'
  > &
    RouterContextOptions<TRouteTree>
  history!: RouterHistory
  #unsubHistory?: () => void
  basepath: string
  // __location: Location<TRoutesInfo['fullSearchSchema']>
  routeTree!: RootRoute
  routesById!: RoutesById<TRoutesInfo>
  navigateTimeout: undefined | Timeout
  nextAction: undefined | 'push' | 'replace'
  navigationPromise: undefined | Promise<void>

  store: Store<RouterStore<TRoutesInfo>>
  state: RouterStore<TRoutesInfo>
  startedLoadingAt = Date.now()
  resolveNavigation = () => {}

  constructor(options?: RouterOptions<TRouteTree>) {
    this.options = {
      defaultPreloadDelay: 50,
      context: undefined!,
      ...options,
      stringifySearch: options?.stringifySearch ?? defaultStringifySearch,
      parseSearch: options?.parseSearch ?? defaultParseSearch,
      fetchServerDataFn: options?.fetchServerDataFn ?? defaultFetchServerDataFn,
    }

    this.store = new Store<RouterStore<TRoutesInfo>>(getInitialRouterState(), {
      onUpdate: (state) => {
        this.state = state
      },
    })
    this.state = this.store.state
    this.basepath = ''

    this.update(options)

    // Allow frameworks to hook into the router creation
    this.options.Router?.(this)
  }

  reset = () => {
    this.store.setState((s) => Object.assign(s, getInitialRouterState()))
  }

  mount = () => {
    // Mount only does anything on the client
    if (!isServer) {
      // If the router matches are empty, load the matches
      if (!this.state.currentMatches.length) {
        this.load()
      }

      const visibilityChangeEvent = 'visibilitychange'
      const focusEvent = 'focus'

      // addEventListener does not exist in React Native, but window does
      // In the future, we might need to invert control here for more adapters
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (window.addEventListener) {
        // Listen to visibilitychange and focus
        window.addEventListener(visibilityChangeEvent, this.#onFocus, false)
        window.addEventListener(focusEvent, this.#onFocus, false)
      }

      return () => {
        if (window.removeEventListener) {
          // Be sure to unsubscribe if a new handler is set

          window.removeEventListener(visibilityChangeEvent, this.#onFocus)
          window.removeEventListener(focusEvent, this.#onFocus)
        }
      }
    }

    return () => {}
  }

  update = (opts?: RouterOptions<TRouteTree>): this => {
    Object.assign(this.options, opts)

    if (
      !this.history ||
      (this.options.history && this.options.history !== this.history)
    ) {
      if (this.#unsubHistory) {
        this.#unsubHistory()
      }

      this.history =
        this.options.history ??
        (isServer ? createMemoryHistory() : createBrowserHistory()!)

      const parsedLocation = this.#parseLocation()

      this.store.setState((s) => ({
        ...s,
        latestLocation: parsedLocation,
        currentLocation: parsedLocation,
      }))

      this.#unsubHistory = this.history.listen(() => {
        this.load({
          next: this.#parseLocation(this.state.latestLocation),
        })
      })
    }

    const { basepath, routeTree } = this.options

    this.basepath = `/${trimPath(basepath ?? '') ?? ''}`

    if (routeTree) {
      this.routesById = {} as any
      this.routeTree = this.#buildRouteTree(routeTree)
    }

    return this
  }

  buildNext = (opts: BuildNextOptions) => {
    const next = this.#buildLocation(opts)

    const matches = this.matchRoutes(next.pathname)

    const __preSearchFilters = matches
      .map((match) => match.route.options.preSearchFilters ?? [])
      .flat()
      .filter(Boolean)

    const __postSearchFilters = matches
      .map((match) => match.route.options.postSearchFilters ?? [])
      .flat()
      .filter(Boolean)

    return this.#buildLocation({
      ...opts,
      __preSearchFilters,
      __postSearchFilters,
    })
  }

  cancelMatches = () => {
    ;[
      ...this.state.currentMatches,
      ...(this.state.pendingMatches || []),
    ].forEach((match) => {
      match.cancel()
    })
  }

  load = async (opts?: {
    next?: ParsedLocation
    // filter?: (match: RouteMatch<any, any>) => any
  }) => {
    let now = Date.now()
    const startedAt = now
    this.startedLoadingAt = startedAt

    // Cancel any pending matches
    this.cancelMatches()

    let matches!: RouteMatch<any, any>[]

    this.store.batch(() => {
      if (opts?.next) {
        // Ingest the new location
        this.store.setState((s) => ({
          ...s,
          latestLocation: opts.next!,
        }))
      }

      // Match the routes
      matches = this.matchRoutes(this.state.latestLocation.pathname, {
        strictParseParams: true,
      })

      this.store.setState((s) => ({
        ...s,
        status: 'pending',
        pendingMatches: matches,
        pendingLocation: this.state.latestLocation,
      }))
    })

    // Load the matches
    try {
      await this.loadMatches(
        matches,
        this.state.pendingLocation!,
        // opts
      )
    } catch (err: any) {
      console.warn(err)
      invariant(
        false,
        'Matches failed to load due to error above ☝️. Navigation cancelled!',
      )
    }

    if (this.startedLoadingAt !== startedAt) {
      // Ignore side-effects of outdated side-effects
      return this.navigationPromise
    }

    const previousMatches = this.state.currentMatches

    const exiting: AnyRouteMatch[] = [],
      staying: AnyRouteMatch[] = []

    previousMatches.forEach((d) => {
      if (matches.find((dd) => dd.id === d.id)) {
        staying.push(d)
      } else {
        exiting.push(d)
      }
    })

    const entering = matches.filter((d) => {
      return !previousMatches.find((dd) => dd.id === d.id)
    })

    now = Date.now()

    exiting.forEach((d) => {
      d.__onExit?.({
        params: d.params,
        search: d.state.routeSearch,
      })

      // Clear non-loading error states when match leaves
      if (d.state.status === 'error') {
        this.store.setState((s) => ({
          ...s,
          status: 'idle',
          error: undefined,
        }))
      }
    })

    staying.forEach((d) => {
      d.route.options.onTransition?.({
        params: d.params,
        search: d.state.routeSearch,
      })
    })

    entering.forEach((d) => {
      d.__onExit = d.route.options.onLoaded?.({
        params: d.params,
        search: d.state.search,
      })
    })

    const prevLocation = this.state.currentLocation

    this.store.setState((s) => ({
      ...s,
      status: 'idle',
      currentLocation: this.state.latestLocation,
      currentMatches: matches,
      pendingLocation: undefined,
      pendingMatches: undefined,
    }))

    matches.forEach((match) => {
      match.__commit()
    })

    if (prevLocation!.href !== this.state.currentLocation.href) {
      this.options.onRouteChange?.()
    }

    this.resolveNavigation()
  }

  getRoute = <TId extends keyof TRoutesInfo['routesById']>(
    id: TId,
  ): TRoutesInfo['routesById'][TId] => {
    const route = this.routesById[id]

    invariant(route, `Route with id "${id as string}" not found`)

    return route
  }

  loadRoute = async (
    navigateOpts: BuildNextOptions = this.state.latestLocation,
  ): Promise<RouteMatch[]> => {
    const next = this.buildNext(navigateOpts)
    const matches = this.matchRoutes(next.pathname, {
      strictParseParams: true,
    })
    await this.loadMatches(matches, next)
    return matches
  }

  preloadRoute = async (
    navigateOpts: BuildNextOptions = this.state.latestLocation,
  ) => {
    const next = this.buildNext(navigateOpts)
    const matches = this.matchRoutes(next.pathname, {
      strictParseParams: true,
    })

    await this.loadMatches(matches, next, {
      preload: true,
    })
    return matches
  }

  matchRoutes = (pathname: string, opts?: { strictParseParams?: boolean }) => {
    const matches: AnyRouteMatch[] = []

    if (!this.routeTree) {
      return matches
    }

    const existingMatches = [
      ...this.state.currentMatches,
      ...(this.state.pendingMatches ?? []),
    ]

    const findInRouteTree = async (
      routes: Route<any, any>[],
    ): Promise<void> => {
      const parentMatch = last(matches)
      let params = parentMatch?.params ?? {}

      const filteredRoutes = this.options.filterRoutes?.(routes) ?? routes

      let matchingRoutes: Route[] = []

      const findMatchInRoutes = (parentRoutes: Route[], routes: Route[]) => {
        routes.some((route) => {
          const children = route.children as undefined | Route[]
          if (!route.path && children?.length) {
            return findMatchInRoutes(
              [...matchingRoutes, route],
              children as any,
            )
          }

          const fuzzy = !!(route.path !== '/' || children?.length)

          const matchParams = matchPathname(this.basepath, pathname, {
            to: route.fullPath,
            fuzzy,
            caseSensitive:
              route.options.caseSensitive ?? this.options.caseSensitive,
          })

          if (matchParams) {
            let parsedParams

            try {
              parsedParams =
                route.options.parseParams?.(matchParams!) ?? matchParams
            } catch (err) {
              if (opts?.strictParseParams) {
                throw err
              }
            }

            params = {
              ...params,
              ...parsedParams,
            }
          }

          if (!!matchParams) {
            matchingRoutes = [...parentRoutes, route]
          }

          return !!matchingRoutes.length
        })

        return !!matchingRoutes.length
      }

      findMatchInRoutes([], filteredRoutes)

      if (!matchingRoutes.length) {
        return
      }

      matchingRoutes.forEach((foundRoute) => {
        const interpolatedPath = interpolatePath(foundRoute.path, params)
        const matchId = interpolatePath(foundRoute.id, params, true)

        const match =
          existingMatches.find((d) => d.id === matchId) ||
          new RouteMatch(this, foundRoute, {
            id: matchId,
            params,
            pathname: joinPaths([this.basepath, interpolatedPath]),
          })

        matches.push(match)
      })

      const foundRoute = last(matchingRoutes)!

      const foundChildren = foundRoute.children as any

      if (foundChildren?.length) {
        findInRouteTree(foundChildren)
      }
    }

    findInRouteTree([this.routeTree as any])

    return matches
  }

  loadMatches = async (
    resolvedMatches: RouteMatch[],
    location: ParsedLocation,
    opts?: {
      preload?: boolean
      // filter?: (match: RouteMatch<any, any>) => any
    },
  ) => {
    // Check each match middleware to see if the route can be accessed
    await Promise.all(
      resolvedMatches.map(async (match) => {
        try {
          await match.route.options.beforeLoad?.({
            router: this as any,
            match,
          })
        } catch (err) {
          if (!opts?.preload) {
            match.route.options.onBeforeLoadError?.(err)
          }

          match.route.options.onError?.(err)

          throw err
        }
      }),
    )

    const matchPromises = resolvedMatches.map(async (match, index) => {
      const parentMatch = resolvedMatches[index - 1]

      match.__load({ preload: opts?.preload, location, parentMatch })

      await match.__loadPromise

      if (parentMatch) {
        await parentMatch.__loadPromise
      }
    })

    await Promise.all(matchPromises)
  }

  reload = () => {
    this.navigate({
      fromCurrent: true,
      replace: true,
      search: true,
    } as any)
  }

  resolvePath = (from: string, path: string) => {
    return resolvePath(this.basepath!, from, cleanPath(path))
  }

  navigate = async <
    TFrom extends ValidFromPath<TRoutesInfo> = '/',
    TTo extends string = '',
  >({
    from,
    to = '' as any,
    search,
    hash,
    replace,
    params,
  }: NavigateOptions<TRoutesInfo, TFrom, TTo>) => {
    // If this link simply reloads the current route,
    // make sure it has a new key so it will trigger a data refresh

    // If this `to` is a valid external URL, return
    // null for LinkUtils
    const toString = String(to)
    const fromString = typeof from === 'undefined' ? from : String(from)
    let isExternal

    try {
      new URL(`${toString}`)
      isExternal = true
    } catch (e) {}

    invariant(
      !isExternal,
      'Attempting to navigate to external url with this.navigate!',
    )

    return this.#commitLocation({
      from: fromString,
      to: toString,
      search,
      hash,
      replace,
      params,
    })
  }

  matchRoute = <
    TFrom extends ValidFromPath<TRoutesInfo> = '/',
    TTo extends string = '',
    TResolved extends string = ResolveRelativePath<TFrom, NoInfer<TTo>>,
  >(
    location: ToOptions<TRoutesInfo, TFrom, TTo>,
    opts?: MatchRouteOptions,
  ): false | TRoutesInfo['routesById'][TResolved]['__types']['allParams'] => {
    location = {
      ...location,
      to: location.to
        ? this.resolvePath(location.from ?? '', location.to)
        : undefined,
    } as any

    const next = this.buildNext(location)
    const baseLocation = opts?.pending
      ? this.state.pendingLocation
      : this.state.currentLocation

    if (!baseLocation) {
      return false
    }

    const match = matchPathname(this.basepath, baseLocation.pathname, {
      ...opts,
      to: next.pathname,
    }) as any

    if (!match) {
      return false
    }

    if (opts?.includeSearch ?? true) {
      return partialDeepEqual(baseLocation.search, next.search) ? match : false
    }

    return match
  }

  buildLink = <
    TFrom extends ValidFromPath<TRoutesInfo> = '/',
    TTo extends string = '',
  >({
    from,
    to = '.' as any,
    search,
    params,
    hash,
    target,
    replace,
    activeOptions,
    preload,
    preloadDelay: userPreloadDelay,
    disabled,
  }: LinkOptions<TRoutesInfo, TFrom, TTo>): LinkInfo => {
    // If this link simply reloads the current route,
    // make sure it has a new key so it will trigger a data refresh

    // If this `to` is a valid external URL, return
    // null for LinkUtils

    try {
      new URL(`${to}`)
      return {
        type: 'external',
        href: to,
      }
    } catch (e) {}

    const nextOpts = {
      from,
      to,
      search,
      params,
      hash,
      replace,
    }

    const next = this.buildNext(nextOpts)

    preload = preload ?? this.options.defaultPreload
    const preloadDelay =
      userPreloadDelay ?? this.options.defaultPreloadDelay ?? 0

    // Compare path/hash for matches
    const currentPathSplit = this.state.currentLocation.pathname.split('/')
    const nextPathSplit = next.pathname.split('/')
    const pathIsFuzzyEqual = nextPathSplit.every(
      (d, i) => d === currentPathSplit[i],
    )
    // Combine the matches based on user options
    const pathTest = activeOptions?.exact
      ? this.state.currentLocation.pathname === next.pathname
      : pathIsFuzzyEqual
    const hashTest = activeOptions?.includeHash
      ? this.state.currentLocation.hash === next.hash
      : true
    const searchTest =
      activeOptions?.includeSearch ?? true
        ? partialDeepEqual(this.state.currentLocation.search, next.search)
        : true

    // The final "active" test
    const isActive = pathTest && hashTest && searchTest

    // The click handler
    const handleClick = (e: MouseEvent) => {
      if (
        !disabled &&
        !isCtrlEvent(e) &&
        !e.defaultPrevented &&
        (!target || target === '_self') &&
        e.button === 0
      ) {
        e.preventDefault()

        // All is well? Navigate!
        this.#commitLocation(nextOpts as any)
      }
    }

    // The click handler
    const handleFocus = (e: MouseEvent) => {
      if (preload) {
        this.preloadRoute(nextOpts).catch((err) => {
          console.warn(err)
          console.warn('Error preloading route! ☝️')
        })
      }
    }

    const handleTouchStart = (e: TouchEvent) => {
      this.preloadRoute(nextOpts).catch((err) => {
        console.warn(err)
        console.warn('Error preloading route! ☝️')
      })
    }

    const handleEnter = (e: MouseEvent) => {
      const target = (e.target || {}) as LinkCurrentTargetElement

      if (preload) {
        if (target.preloadTimeout) {
          return
        }

        target.preloadTimeout = setTimeout(() => {
          target.preloadTimeout = null
          this.preloadRoute(nextOpts).catch((err) => {
            console.warn(err)
            console.warn('Error preloading route! ☝️')
          })
        }, preloadDelay)
      }
    }

    const handleLeave = (e: MouseEvent) => {
      const target = (e.target || {}) as LinkCurrentTargetElement

      if (target.preloadTimeout) {
        clearTimeout(target.preloadTimeout)
        target.preloadTimeout = null
      }
    }

    return {
      type: 'internal',
      next,
      handleFocus,
      handleClick,
      handleEnter,
      handleLeave,
      handleTouchStart,
      isActive,
      disabled,
    }
  }

  dehydrate = (): DehydratedRouter => {
    return {
      state: {
        ...pick(this.state, [
          'latestLocation',
          'currentLocation',
          'status',
          'lastUpdated',
        ]),
        currentMatches: this.state.currentMatches.map((match) => ({
          id: match.id,
          state: {
            status: match.state.status,
          },
        })),
      },
    }
  }

  hydrate = (dehydratedRouter: DehydratedRouter) => {
    this.store.setState((s) => {
      // Match the routes
      const currentMatches = this.matchRoutes(
        dehydratedRouter.state.latestLocation.pathname,
        {
          strictParseParams: true,
        },
      )

      currentMatches.forEach((match, index) => {
        const dehydratedMatch = dehydratedRouter.state.currentMatches[index]
        invariant(
          dehydratedMatch && dehydratedMatch.id === match.id,
          'Oh no! There was a hydration mismatch when attempting to hydrate the state of the router! 😬',
        )
        match.store.setState((s) => ({
          ...s,
          ...dehydratedMatch.state,
        }))
      })

      return {
        ...s,
        ...dehydratedRouter.state,
        currentMatches,
      }
    })
  }

  #buildRouteTree = (routeTree: AnyRoute) => {
    const recurseRoutes = (routes: Route[]) => {
      routes.forEach((route, i) => {
        route.init({ originalIndex: i, router: this })

        const existingRoute = (this.routesById as any)[route.id]

        if (existingRoute) {
          if (process.env.NODE_ENV !== 'production') {
            console.warn(
              `Duplicate routes found with id: ${String(route.id)}`,
              this.routesById,
              route,
            )
          }
          throw new Error()
        }

        ;(this.routesById as any)[route.id] = route

        const children = route.children as Route[]

        if (children?.length) recurseRoutes(children)
      })
    }

    recurseRoutes([routeTree] as Route[])

    return routeTree
  }

  #parseLocation = (previousLocation?: ParsedLocation): ParsedLocation => {
    let { pathname, search, hash, state } = this.history.location

    const parsedSearch = this.options.parseSearch(search)

    return {
      pathname: pathname,
      searchStr: search,
      search: replaceEqualDeep(previousLocation?.search, parsedSearch),
      hash: hash.split('#').reverse()[0] ?? '',
      href: `${pathname}${search}${hash}`,
      state: state as LocationState,
      key: state?.key || '__init__',
    }
  }

  #onFocus = () => {
    this.load()
  }

  #buildLocation = (dest: BuildNextOptions = {}): ParsedLocation => {
    dest.fromCurrent = dest.fromCurrent ?? dest.to === ''

    const fromPathname = dest.fromCurrent
      ? this.state.latestLocation.pathname
      : dest.from ?? this.state.latestLocation.pathname

    let pathname = resolvePath(
      this.basepath ?? '/',
      fromPathname,
      `${dest.to ?? ''}`,
    )

    const fromMatches = this.matchRoutes(this.state.latestLocation.pathname, {
      strictParseParams: true,
    })

    const toMatches = this.matchRoutes(pathname)

    const prevParams = { ...last(fromMatches)?.params }

    let nextParams =
      (dest.params ?? true) === true
        ? prevParams
        : functionalUpdate(dest.params!, prevParams)

    if (nextParams) {
      toMatches
        .map((d) => d.route.options.stringifyParams)
        .filter(Boolean)
        .forEach((fn) => {
          Object.assign({}, nextParams!, fn!(nextParams!))
        })
    }

    pathname = interpolatePath(pathname, nextParams ?? {})

    // Pre filters first
    const preFilteredSearch = dest.__preSearchFilters?.length
      ? dest.__preSearchFilters?.reduce(
          (prev, next) => next(prev),
          this.state.latestLocation.search,
        )
      : this.state.latestLocation.search

    // Then the link/navigate function
    const destSearch =
      dest.search === true
        ? preFilteredSearch // Preserve resolvedFrom true
        : dest.search
        ? functionalUpdate(dest.search, preFilteredSearch) ?? {} // Updater
        : dest.__preSearchFilters?.length
        ? preFilteredSearch // Preserve resolvedFrom filters
        : {}

    // Then post filters
    const postFilteredSearch = dest.__postSearchFilters?.length
      ? dest.__postSearchFilters.reduce((prev, next) => next(prev), destSearch)
      : destSearch

    const search = replaceEqualDeep(
      this.state.latestLocation.search,
      postFilteredSearch,
    )

    const searchStr = this.options.stringifySearch(search)
    let hash =
      dest.hash === true
        ? this.state.latestLocation.hash
        : functionalUpdate(dest.hash!, this.state.latestLocation.hash)
    hash = hash ? `#${hash}` : ''

    return {
      pathname,
      search,
      searchStr,
      state: this.state.latestLocation.state,
      hash,
      href: `${pathname}${searchStr}${hash}`,
      key: dest.key,
    }
  }

  #commitLocation = async (
    location: BuildNextOptions & { replace?: boolean },
  ) => {
    const next = this.buildNext(location)
    const id = '' + Date.now() + Math.random()

    if (this.navigateTimeout) clearTimeout(this.navigateTimeout)

    let nextAction: 'push' | 'replace' = 'replace'

    if (!location.replace) {
      nextAction = 'push'
    }

    const isSameUrl = this.state.latestLocation.href === next.href

    if (isSameUrl && !next.key) {
      nextAction = 'replace'
    }

    const href = `${next.pathname}${next.searchStr}${
      next.hash ? `#${next.hash}` : ''
    }`

    this.history[nextAction === 'push' ? 'push' : 'replace'](href, {
      id,
      ...next.state,
    })

    // this.load(this.#parseLocation(this.state.latestLocation))

    return (this.navigationPromise = new Promise((resolve) => {
      const previousNavigationResolve = this.resolveNavigation

      this.resolveNavigation = () => {
        previousNavigationResolve()
        resolve()
      }
    }))
  }
}

// Detect if we're in the DOM
const isServer = typeof window === 'undefined' || !window.document.createElement

function getInitialRouterState(): RouterStore<any, any> {
  return {
    status: 'idle',
    latestLocation: null!,
    currentLocation: null!,
    currentMatches: [],
    lastUpdated: Date.now(),
  }
}

function isCtrlEvent(e: MouseEvent) {
  return !!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey)
}
