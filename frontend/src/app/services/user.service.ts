import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  public getUserInfo(): Observable<UserInfo> {
    return this.http.get<UserInfo>('/api/selfinfo')
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
