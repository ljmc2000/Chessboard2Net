import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';

import { UserInfo } from 'models/user-info';
import { UserService } from 'services/user.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements UserInfo {
  title = 'Chessboard2Net';
  public user_id: string;
  public username: string;
  public logged_in: boolean;

  constructor(
    private http: HttpClient,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,

    public userService: UserService
  ) {
    this.registerIcons();
    this.userService.getUserInfo(this)
  }

  registerIcons() {
    this.iconRegistry.addSvgIcon('favicon', this.sanitizer.bypassSecurityTrustResourceUrl('/assets/doodles_white_src/pawn.svg'));
  }
}
