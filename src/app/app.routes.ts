import { Routes } from '@angular/router';

export const routes: Routes = [
    {
    path: '',
    pathMatch: 'full',
    redirectTo: 'search',
  },
  {
    path: 'search',
    loadComponent: () =>
      import('./features/pages/search-page/search-page').then((m) => m.SearchPage),
  },
  {
    path: 'flights/:id',
    loadComponent: () =>
      import('./features/pages/detail-page/detail-page').then(
        (m) => m.DetailPage
      ),
  },
  {
    path: '**',
    redirectTo: 'search',
  },
];
