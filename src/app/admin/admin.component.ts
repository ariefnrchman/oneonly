import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ModalProductComponent } from './components/modal-product/modal-product.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  listData: any = [];
  getId?: string;
  nameResep?: string;
  isEmpty: boolean = true;

  constructor(
    public auth: AngularFireAuth,
    public fire: AngularFirestore,
    public router: Router,
    public modalService: NgbModal,
    config: NgbModalConfig,
  ) {
    config.backdrop = 'static';
    config.keyboard = false;

    auth.authState.subscribe(resp => {
      if(!resp) {
        router.navigateByUrl('/auth');
      } else {
        fire.collection('user').ref.where('email', '==', resp!.email).onSnapshot(snapshot => {
          snapshot.forEach(ref => {
            this.getData(ref.data()['username']);
          })
        })
      }
    })
  }

  ngOnInit(): void {
  }

  getData(author: String) {
    this.fire.collection('resep', ref => ref.where('author', '==', author)).snapshotChanges().subscribe((resp) => {
      this.listData = resp
      if (this.listData.length != 0) this.isEmpty = false;
    })
  }

  getDetail(id: string) {
    console.log(id);
    const modalRef = this.modalService.open(ModalProductComponent);
    modalRef.componentInstance.id = id;
  }

  confirmDeleteResep(modal: any, name: string, id: string) {
    this.nameResep = name;
    this.getId = id;
    this.modalService.open(modal);
  }

  deleteResep(modal: any) {
    this.modalService.dismissAll(modal);
    return this.fire
      .collection("resep")
      .doc(this.getId)
      .delete();
  }

  openModal() {
    this.modalService.open(ModalProductComponent);
  }

  logOut() {
    this.auth.signOut().then(resp => {
      this.router.navigateByUrl('auth');
    });
  }

}
