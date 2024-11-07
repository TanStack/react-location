import * as React from 'react'
import invariant from 'tiny-invariant'
import { useRouterState } from './useRouterState'
import { matchContext } from './matchContext'
import type {
  StructuralSharingOption,
  ValidateSelected,
} from './structuralSharing'
import type { AnyRouter, RegisteredRouter } from './router'
import type { MakeRouteMatch } from './Matches'
import type { StrictOrFrom, ThrowOrOptional } from './utils'

export interface UseMatchBaseOptions<
  TRouter extends AnyRouter,
  TFrom,
  TStrict extends boolean,
  TThrow,
  TSelected,
  TStructuralSharing extends boolean,
> {
  select?: (
    match: MakeRouteMatch<TRouter['routeTree'], TFrom, TStrict>,
  ) => ValidateSelected<TRouter, TSelected, TStructuralSharing>
  shouldThrow?: TThrow
}

export type UseMatchRoute<TFrom> = <
  TRouter extends AnyRouter = RegisteredRouter,
  TSelected = unknown,
  TStructuralSharing extends boolean = boolean,
>(
  opts?: UseMatchBaseOptions<
    TRouter,
    TFrom,
    true,
    true,
    TSelected,
    TStructuralSharing
  > &
    StructuralSharingOption<TRouter, TSelected, TStructuralSharing>,
) => UseMatchResult<TRouter, TFrom, true, TSelected>

export type UseMatchOptions<
  TRouter extends AnyRouter,
  TFrom extends string | undefined,
  TStrict extends boolean,
  TSelected,
  TThrow extends boolean,
  TStructuralSharing extends boolean,
> = StrictOrFrom<TRouter, TFrom, TStrict> &
  UseMatchBaseOptions<
    TRouter,
    TFrom,
    TStrict,
    TThrow,
    TSelected,
    TStructuralSharing
  > &
  StructuralSharingOption<TRouter, TSelected, TStructuralSharing>

export type UseMatchResult<
  TRouter extends AnyRouter,
  TFrom,
  TStrict extends boolean,
  TSelected,
> = unknown extends TSelected
  ? MakeRouteMatch<TRouter['routeTree'], TFrom, TStrict>
  : TSelected

export function useMatch<
  TRouter extends AnyRouter = RegisteredRouter,
  TFrom extends string | undefined = undefined,
  TStrict extends boolean = true,
  TThrow extends boolean = true,
  TSelected = unknown,
  TStructuralSharing extends boolean = boolean,
>(
  opts: UseMatchOptions<
    TRouter,
    TFrom,
    TStrict,
    TSelected,
    TThrow,
    TStructuralSharing
  >,
): ThrowOrOptional<UseMatchResult<TRouter, TFrom, TStrict, TSelected>, TThrow> {
  const nearestMatchId = React.useContext(matchContext)

  const matchSelection = useRouterState({
    select: (state: any) => {
      const match = state.matches.find((d: any) =>
        opts.from ? opts.from === d.routeId : d.id === nearestMatchId,
      )
      invariant(
        !((opts.shouldThrow ?? true) && !match),
        `Could not find ${opts.from ? `an active match from "${opts.from}"` : 'a nearest match!'}`,
      )

      if (match === undefined) {
        return undefined
      }

      return opts.select ? opts.select(match) : match
    },
    structuralSharing: opts.structuralSharing,
  } as any)

  return matchSelection as any
}
