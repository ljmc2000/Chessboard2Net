import { Routes } from '@angular/router';
import { MainComponent } from 'components/main/main.component';
import { LoginComponent } from 'components/login/login.component';
import { SettingsComponent } from 'components/settings/settings.component';

export const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'login', component: LoginComponent },
  { path: 'settings', component: SettingsComponent },
];
