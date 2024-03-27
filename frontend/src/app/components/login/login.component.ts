import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';

import { UserService } from 'services/user.service';
import { LoginDetails } from 'models/login-details';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MatInputModule, MatButtonModule, MatTabsModule, MatFormFieldModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements LoginDetails {

  username: string;
  password: string;
  confirmPassword: string;
  issue: number;

  constructor(public userService: UserService) {
  }

  onError(reason: number) {
    this.issue=reason;
  }
}
