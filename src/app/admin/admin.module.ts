import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AdminComponent } from './admin.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { ModalProductComponent } from './components/modal-product/modal-product.component';



@NgModule({
  declarations: [
    AdminComponent,
    NavbarComponent,
    ModalProductComponent,
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    NgbModule,
    RouterModule.forChild([
      {
        path: '',
        component: AdminComponent
      }
    ]),
  ],
  providers: [
    DatePipe
  ],
})
export class AdminModule { }
