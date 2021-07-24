import { Component, OnInit } from '@angular/core';
import { AuthComponent } from '../auth.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../auth.component.scss']
})
export class RegisterComponent implements OnInit {
  register: any = {};

  constructor(
    public auth: AuthComponent
  ) { }

  ngOnInit(): void {
  }

  tapRegister() {
    this.auth.tapRegister(this.register);
  }

}
