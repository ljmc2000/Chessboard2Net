import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule } from '@angular/material/slider';

import { parse_colour } from 'utils';
import { UserInfo } from 'models/user-info';
import { UserService } from 'services/user.service';
import * as S from 'shared/chess-sets';
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
  unlocked_sets: number;

  favouriteColourRed: number=0;
  favouriteColourGreen: number=0;
  favouriteColourBlue: number=0;
  visibleAsOnline: boolean;

  @ViewChild('doodlePawn') doodlePawn: ElementRef;
  @ViewChild('goblinPawn') goblinPawn: ElementRef;
  @ViewChild('teatimePawn') teatimePawn: ElementRef;

  constructor(public userService: UserService, private http: HttpClient) {
    this.userService.getUserInfo(this)
    .then(()=>this.parseFlags())
    .then(()=>this.parseColour())
    .then(()=>this.loadSets());
  }

  getFavouriteColourString() {
    return parse_colour(this.favourite_colour);
  }

  loadSet(setId: number, target: ElementRef, pawn: string) {
    fetch(setId&this.unlocked_sets?pawn:'assets/locked.svg')
    .then(resp=>resp.text())
    .then(body=>{
      target.nativeElement.innerHTML=body
      target.nativeElement.children[0].style.height="128px"
      target.nativeElement.children[0].style.width="128px"
    })
    .then(()=>this.updateSetColours())
  }

  loadSets() {
    this.loadSet(S.DOODLES, this.doodlePawn,'/assets/doodles_white_src/pawn.svg')
    this.loadSet(S.GOBLINS, this.goblinPawn,'/assets/goblins_src/pawn.svg')
    this.loadSet(S.TEATIME, this.teatimePawn,'/assets/teatime_src/pawn.svg')
  }

  onChangeColour() {
    this.favourite_colour=(this.favouriteColourRed<<16)+(this.favouriteColourGreen<<8)+(this.favouriteColourBlue)

    this.updateSetColours()
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

  showSet(flag: number) {
    return (flag&this.unlocked_sets)!=0;
  }

  updateSetColours() {
    var color = this.getFavouriteColourString()
    var icons_list = document.querySelectorAll<SVGElement>('.set_icon .opponent_colour')
    icons_list.forEach((icon: SVGElement, key, parent)=>{
      icon.style.fill=color
    })
  }
}
