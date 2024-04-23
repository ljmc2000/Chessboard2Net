import { Routes } from '@angular/router';
import { GameComponent, SpectateComponent } from 'components/game/game.component';
import { LobbyComponent } from 'components/lobby/lobby.component';
import { LoginComponent } from 'components/login/login.component';
import { ReplayBrowserComponent } from 'components/replay-browser/replay-browser.component';
import { ReplayViewerComponent } from 'components/replay-viewer/replay-viewer.component';
import { SettingsComponent } from 'components/settings/settings.component';

export const routes: Routes = [
  { path: 'game', component: GameComponent },
  { path: 'login', component: LoginComponent },
  { path: 'replay/:game_id', component: ReplayViewerComponent },
  { path: 'replays', component: ReplayBrowserComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'spectate/:game_id', component: SpectateComponent },
  { path: '**', component: LobbyComponent },
];
