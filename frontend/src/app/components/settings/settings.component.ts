import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { MatCheckboxModule } from '@angular/material/checkbox';

import { UserInfo } from 'models/user-info';
import { UserService } from 'services/user.service';
import * as U from 'shared/user-profile-flags';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule, MatCheckboxModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements UserInfo {

  profile_flags: number;

  visibleAsOnline: boolean;

  constructor(public userService: UserService, private http: HttpClient) {
    this.userService.getUserInfo(this)
    .then(()=>this.parseFlags());
  }

  parseFlags() {
    this.visibleAsOnline=(this.profile_flags&U.VISIBLE_AS_ONLINE)!=0;
  }

  onChangeFlags() {
    this.profile_flags = (
      Number(this.visibleAsOnline)<<U.VISIBLE_AS_ONLINE_FLAG
    );
    this.http.post('/api/update_prefs',{profile_flags: this.profile_flags})
    .subscribe(this.parseFlags)
  }
}
