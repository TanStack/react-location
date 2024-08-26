import { ErrorComponent, createFileRoute } from '@tanstack/react-router'
import axios from 'redaxios'
import type { ErrorComponentProps } from '@tanstack/react-router'
import type { User } from '~/utils/users'
import { NotFound } from '~/components/NotFound'

export const Route = createFileRoute('/users/$userId')({
  loader: async ({ params: { userId } }) => {
    return await axios
      .get<User>('http://localhost:3000/api/users/' + userId)
      .then((r) => r.data)
      .catch(() => {
        throw new Error('Failed to fetch user')
      })
  },
  errorComponent: UserErrorComponent,
  component: UserComponent,
  notFoundComponent: () => {
    return <NotFound>User not found</NotFound>
  },
})

export function UserErrorComponent({ error }: ErrorComponentProps) {
  return <ErrorComponent error={error} />
}

function UserComponent() {
  const post = Route.useLoaderData()

  return (
    <div className="space-y-2">
      <h4 className="text-xl font-bold underline">{post.name}</h4>
      <div className="text-sm">{post.email}</div>
    </div>
  )
}
