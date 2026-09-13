import { Routes } from '@angular/router';
import { ChatAppComponent } from './chatapp/chatapp.component';
import { JoinWindowComponent } from './chatapp/components/join/join.component';
import { ShareWindowComponent } from './chatapp/components/share/share.component';

export const routes: Routes = [
  {
    path: 'main',
    component: ChatAppComponent,
    children: [
      {
        path: 'chat',
        loadComponent: () =>
          import('./chatapp/components/chatwindow/chatwindow.component').then(
            (m) => m.ChatWindowComponent,
          ),
        children: [{ path: 'share', component: ShareWindowComponent }],
      },
      { path: 'join/:id', component: JoinWindowComponent },
    ],
  },
  {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full',
  },
];
