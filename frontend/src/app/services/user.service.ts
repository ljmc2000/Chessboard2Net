import { Injectable } from '@angular/core';
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

  private login_or_register(login: LoginDetails, endpoint: string) {
    this.http.post(endpoint, login)
    .subscribe(resp=>window.location.href="/", err=>login.onError(err.status))
  }

  public getUserInfo(reciever: UserInfo) {
    this.http.get<UserInfo>('/api/selfinfo')
    .subscribe((src)=>{
      reciever.user_id=src.user_id;
      reciever.username=src.username;
      reciever.logged_in=src.logged_in;
    })
  }

  public login(details: LoginDetails) {
    this.login_or_register(details, '/api/login')
  }

  public register(details: LoginDetails) {
    this.login_or_register(details, '/api/register')
  }

  public logout() {
    fetch('/api/logout').then(resp=>{
      if(resp.status==200)
        window.location.reload();
      else
        alert(resp)
    })
  }
}
