import { AuthComponent } from './../auth.component';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  login: any = {};

  constructor(
    public auth: AuthComponent
  ) {
  }

  ngOnInit(): void {
  }

  tapLogin() {
    this.auth.tapLogin(this.login);
  }

}
