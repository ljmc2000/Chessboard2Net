import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule } from '@angular/material/slider';

import { parse_colour } from 'utils';
import { UserInfo } from 'models/user-info';
import { UserService } from 'services/user.service';
import * as U from 'shared/user-profile-flags';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatCheckboxModule, MatSliderModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements UserInfo {

  profile_flags: number;
  favourite_colour: number=0;

  favouriteColourRed: number=0;
  favouriteColourGreen: number=0;
  favouriteColourBlue: number=0;
  visibleAsOnline: boolean;

  constructor(public userService: UserService, private http: HttpClient) {
    this.userService.getUserInfo(this)
    .then(()=>this.parseFlags())
    .then(()=>this.parseColour());
  }

  getFavouriteColourString() {
    return parse_colour(this.favourite_colour);
  }

  onChangeColour() {
    this.favourite_colour=(this.favouriteColourRed<<16)+(this.favouriteColourGreen<<8)+(this.favouriteColourBlue)
  }

  onChangeFlags() {
    this.profile_flags = (
      Number(this.visibleAsOnline)<<U.VISIBLE_AS_ONLINE_FLAG
    );
    this.http.post('/api/update_prefs',{profile_flags: this.profile_flags})
    .subscribe(this.parseFlags)
  }

  parseColour() {
    this.favouriteColourRed=(this.favourite_colour>>16)%256;
    this.favouriteColourGreen=(this.favourite_colour>>8)%256;
    this.favouriteColourBlue=this.favourite_colour%256;
  }

  parseFlags() {
    this.visibleAsOnline=(this.profile_flags&U.VISIBLE_AS_ONLINE)!=0;
  }

  saveColour() {
    this.http.post('/api/update_prefs',{favourite_colour: this.favourite_colour})
    .subscribe()
  }
}
