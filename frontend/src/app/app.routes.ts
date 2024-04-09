import { Routes } from '@angular/router';
import { ChatComponent } from 'components/chat/chat.component';
import { GameComponent } from 'components/game/game.component';
import { LoginComponent } from 'components/login/login.component';
import { SettingsComponent } from 'components/settings/settings.component';

export const routes: Routes = [
  { path: 'chat', component: ChatComponent },
  { path: 'game/:game/:game_id', component: GameComponent },
  { path: 'login', component: LoginComponent },
  { path: 'settings', component: SettingsComponent },
  { path: '**', component: ChatComponent },
];
