import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { catchError } from 'rxjs';

import { UserInfo } from 'models/user-info';
import { LoginDetails } from 'models/login-details';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  private login_or_register(login: LoginDetails, endpoint: string, redirect: string) {
    this.http.post(endpoint, login)
    .subscribe(resp=>window.location.pathname=redirect, err=>login.onError(err.status))
  }

  public getUserInfo(reciever: UserInfo) {
    return fetch('/api/selfinfo')
    .then(resp=>resp.json())
    .then((src: UserInfo)=>{
      if(!src.logged_in && window.location.pathname!='/login')
        window.location.pathname='/login';

      reciever.user_id=src.user_id;
      reciever.username=src.username;
      reciever.profile_flags=src.profile_flags;
      reciever.prefered_set=src.prefered_set;
      reciever.favourite_colour=src.favourite_colour;
      reciever.logged_in=src.logged_in;
    })
  }

  public login(details: LoginDetails) {
    this.login_or_register(details, '/api/login', '/')
  }

  public register(details: LoginDetails) {
    this.login_or_register(details, '/api/register', '/settings')
  }

  public logout() {
    fetch('/api/logout').then(resp=>{
      if(resp.status==200)
        window.location.pathname='/login';
      else
        alert(resp)
    })
  }
}
