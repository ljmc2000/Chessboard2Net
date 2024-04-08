import { Routes } from '@angular/router';
import { ChatComponent } from 'components/chat/chat.component';
import { CheckersComponent } from 'components/game/checkers.component';
import { ChessComponent } from 'components/game/chess.component';
import { LoginComponent } from 'components/login/login.component';
import { SettingsComponent } from 'components/settings/settings.component';

export const routes: Routes = [
  { path: 'chat', component: ChatComponent },
  { path: 'game/checkers/:game_id', component: CheckersComponent },
  { path: 'game/chess/:game_id', component: ChessComponent },
  { path: 'login', component: LoginComponent },
  { path: 'settings', component: SettingsComponent },
  { path: '**', component: ChatComponent },
];
