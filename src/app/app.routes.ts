import { Routes } from '@angular/router';
import { JoinWindowComponent } from './chatapp/components/join/join.component';
import { ShareWindowComponent } from './chatapp/components/share/share.component';
import { Tabs } from './chatapp/tabs/tabs.page';

export const routes: Routes = [
  {
    path: '',
    component: Tabs,
    children: [
      {
        path: 'calls',
        loadComponent: () =>
          import('./chatapp/components/calls/calls.page').then((m) => m.Calls),
      },
      {
        path: 'home',
        loadComponent: () =>
          import('./chatapp/components/home/home.page').then((m) => m.Home),
      },
      {
        path: 'main',
        loadComponent: () =>
          import('./chatapp/components/menu/menu.component').then(
            (m) => m.MenuComponent,
          ),
        children: [],
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./chatapp/components/settings/settings.page').then(
            (m) => m.Settings,
          ),
      },
      {
        path: '',
        redirectTo: 'main',
        pathMatch: 'full',
      },
    ],
  },

  {
    path: 'profile',
    loadComponent: () =>
      import('./chatapp/components/profile/profile.page').then(
        (m) => m.Profile,
      ),
  },

  {
    path: 'main/chat/:id',
    loadComponent: () =>
      import('./chatapp/components/chatwindow/chatwindow.component').then(
        (m) => m.ChatWindowComponent,
      ),
    children: [{ path: 'share', component: ShareWindowComponent }],
  },
  { path: 'join/:id', component: JoinWindowComponent },
];
