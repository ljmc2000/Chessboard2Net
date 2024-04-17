import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';

import { parse_colour, set_for } from 'utils';
import { UserInfo } from 'models/user-info';
import { PieceColourService } from 'services/piece-colour.service';
import { UserService } from 'services/user.service';
import { UserProfileFlag } from 'shared/constants';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatCheckboxModule, MatIconModule, MatInputModule, MatSliderModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {

  user_id: string;
  username: string;
  profile_flags: number=0;
  favourite_colour: number=0;
  prefered_set: number;
  unlocked_sets: number[]=[];

  favouriteColourRed: number=0;
  favouriteColourGreen: number=0;
  favouriteColourBlue: number=0;
  favouriteColourString: string='#ffffff';
  allowSpectators: boolean;
  visibleAsOnline: boolean;

  constructor(
    public userService: UserService,
    private http: HttpClient,
    private colourService: PieceColourService
  ) {
    this.userService.getUserInfo()
    .subscribe((userinfo: UserInfo)=> {
      this.user_id=userinfo.user_id;
      this.username=userinfo.username;
      this.profile_flags=userinfo.profile_flags;
      this.favourite_colour=userinfo.favourite_colour;
      this.prefered_set=userinfo.prefered_set;
      this.unlocked_sets=userinfo.unlocked_sets;

      this.parseFlags();
      this.parseColour();
      this.favouriteColourString=parse_colour(this.favourite_colour);
      this.colourService.setColour('set_icon','custom_colour',this.favouriteColourString)
    });
  }

  onChangeColour() {
    this.favourite_colour=(this.favouriteColourRed<<16)+(this.favouriteColourGreen<<8)+(this.favouriteColourBlue)

    this.favouriteColourString=parse_colour(this.favourite_colour);
    this.colourService.setColour('set_icon','custom_colour',this.favouriteColourString)
  }

  onChangeColourString() {
    this.favourite_colour=Number.parseInt(this.favouriteColourString.replace('#',''),16)
    this.parseColour()
  }

  onChangeFlags() {
    this.profile_flags = (
      (this.visibleAsOnline?UserProfileFlag.VISIBLE_AS_ONLINE:0) +
      (this.allowSpectators?UserProfileFlag.ALLOW_SPECTATORS:0)
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
    this.visibleAsOnline=(this.profile_flags&UserProfileFlag.VISIBLE_AS_ONLINE)!=0;
    this.allowSpectators=(this.profile_flags&UserProfileFlag.ALLOW_SPECTATORS)!=0;
  }

  pieceFor(piece: string) {
    return set_for(this.prefered_set)+'/'+piece
  }

  saveColour() {
    this.http.post('/api/update_prefs',{favourite_colour: this.favourite_colour})
    .subscribe()
  }

  setFavoriteSet(set_id: number) {
    this.http.post('/api/update_prefered_set',{prefered_set: set_id})
    .subscribe(()=>this.prefered_set=set_id)
  }

  setFor(id: number) {
    return this.unlocked_sets.includes(id)?set_for(id)+'/pawn':'locked';
  }
}
