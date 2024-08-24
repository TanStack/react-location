import { json } from '@tanstack/start'
import { createAPIRoute } from '@tanstack/start/server'

export const Route = createAPIRoute('/api/foo/$')({
  GET: ({ request, params }) => {
    return json({ message: 'Hello /api/foo/$' })
  },
})
