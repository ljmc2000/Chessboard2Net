import { Routes } from '@angular/router';
import { ChatComponent } from 'components/chat/chat.component';
import { GameComponent, SpectateComponent } from 'components/game/game.component';
import { LobbyComponent } from 'components/lobby/lobby.component';
import { LoginComponent } from 'components/login/login.component';
import { SettingsComponent } from 'components/settings/settings.component';

export const routes: Routes = [
  { path: 'game', component: GameComponent },
  { path: 'login', component: LoginComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'spectate/:game_id', component: SpectateComponent },
  { path: '**', component: LobbyComponent },
];
