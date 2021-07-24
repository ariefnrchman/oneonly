import { Component, OnInit } from '@angular/core';
import { AdminComponent } from '../../admin.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(
    private admin: AdminComponent
  ) { }

  ngOnInit(): void {
  }

  showModal() {
    this.admin.openModal();
  }

  logOut() {
    this.admin.logOut();
  }


}
