import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserInfo } from 'models/user-info';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  getUserInfo(reciever: UserInfo) {
    this.http.get<UserInfo>('/api/selfinfo')
    .subscribe((src)=>{
      reciever.user_id=src.user_id;
      reciever.username=src.username;
      reciever.logged_in=src.logged_in;
    })
  }

  logout() {
    console.log("logging out")
    fetch('/api/logout').then(resp=>{
      if(resp.status==200)
        window.location.reload();
      else
        alert(resp)
    })
  }
}
