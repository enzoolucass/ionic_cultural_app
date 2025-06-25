// cultural_events_app/src/app/app.routes.ts

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: '',
    redirectTo: '/tabs/tab1', // Redireciona para a primeira aba como padrão
    pathMatch: 'full',
  },
  {
    path: 'event-form', // Rota para criar novo evento
    loadComponent: () => import('./event-form/event-form.page').then(m => m.EventFormPage)
  },
  {
    path: 'event-form/:id', // Rota para editar evento existente (com ID)
    loadComponent: () => import('./event-form/event-form.page').then(m => m.EventFormPage)
  },
  {
    path: 'artist-form', // Rota para criar novo artista
    loadComponent: () => import('./artist-form/artist-form.page').then(m => m.ArtistFormPage)
  },
  {
    path: 'artist-form/:id', // Rota para editar artista existente (com ID)
    loadComponent: () => import('./artist-form/artist-form.page').then(m => m.ArtistFormPage)
  },
];