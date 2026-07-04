import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'f/:slug',
    renderMode: RenderMode.Server
  },
  {
    path: 'dashboard/builder/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'dashboard/benefits',
    renderMode: RenderMode.Server
  },
  {
    path: 'dashboard/profile',
    renderMode: RenderMode.Server
  },
  {
    path: 'dashboard/reviews',
    renderMode: RenderMode.Server
  },
  {
    path: 'p/:page',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
