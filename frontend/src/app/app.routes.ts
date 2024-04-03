import { Routes } from '@angular/router';
import { ChatComponent } from 'components/chat/chat.component';
import { LoginComponent } from 'components/login/login.component';
import { SettingsComponent } from 'components/settings/settings.component';

export const routes: Routes = [
  { path: 'chat', component: ChatComponent },
  { path: 'login', component: LoginComponent },
  { path: 'settings', component: SettingsComponent },
  { path: '**', component: ChatComponent },
];
