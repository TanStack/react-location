const $$splitLoaderImporter = () => import('conditional-properties.tsx?tsr-split=loader');
import { lazyFn } from '@tanstack/react-router';
const $$splitComponentImporter = () => import('conditional-properties.tsx?tsr-split=component---errorComponent---notFoundComponent---pendingComponent');
import { lazyRouteComponent } from '@tanstack/react-router';
import { createFileRoute } from '@tanstack/react-router';
export const Route = createFileRoute('/posts')({
  component: lazyRouteComponent($$splitComponentImporter, 'component', () => Route.ssr, import.meta.url),
  loader: lazyFn($$splitLoaderImporter, 'loader')
});