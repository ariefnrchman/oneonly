import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Component, Input, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from "rxjs/operators";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-modal-product',
  templateUrl: './modal-product.component.html',
  styleUrls: ['./modal-product.component.scss']
})
export class ModalProductComponent implements OnInit {

  imgSrc: string = "assets/img/photo.png";
  dataUser: any = {};
  resep: any = {};

  listBahan: string[] = [];
  showTambah: boolean = false;
  selectedImage?: string;
  imgUrl: string = "";
  title: string = "";
  
  loading: boolean = false;
  isAdmin: boolean = false;

  now: number = Date.now();

  @Input() id: any;  

  constructor(
    public activeModal: NgbActiveModal,
    private fire: AngularFirestore,
    private storage: AngularFireStorage,
    user: AngularFireAuth,
    private datePipe: DatePipe
  ) {
    user.authState.subscribe(resp =>{
      fire.collection('user').ref.where('email', '==', resp!.email).onSnapshot(snapshot => {
        snapshot.forEach(ref => {
          this.dataUser = ref.data();
          if(this.dataUser.role == 'admin') {
            this.isAdmin = true;
          }
        })
      })
    })
   }

  ngOnInit(): void {
    this.getData()
  }

  btnTambah() {
    this.showTambah = true;
  }

  btnBatal() {
    this.showTambah = false;
  }

  getData() {
    console.log(this.dataUser);
    if(this.id != null) {
      this.title = "Detail Resep";
      this.fire.collection('resep').doc(this.id).get().subscribe((resp) => {
        this.resep = resp.data();
        this.listBahan = this.resep['bahan'];
        this.imgSrc = this.resep['image_url'];
      })
    } else {
      this.title = "Tambah Resep";
    }
  }

  getImage(url: any) {
    if(url.target.files && url.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (u: any) => this.imgSrc = u.target.result;
      reader.readAsDataURL(url.target.files[0]);
      this.selectedImage! = url.target.files[0];
      this.imgUrl = url.target.files[0]['name'];
    } else {
      this.imgSrc = "assets/img/photo.png";
      this.selectedImage!;
    }
  }

  tambahBahan(arg: any) {
    this.listBahan.push(arg.target.value);
    this.resep['bahan'] = this.listBahan;
    this.showTambah = false;
  }

  simpanResep() {
    this.loading = true;
    if(this.imgUrl == "") {
      this.fire.collection('resep').doc(this.id).update(this.resep);
      this.activeModal.close();
    } else {
      var filePath = `resep/${this.imgUrl.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
      var fileRef = this.storage.ref(filePath);

      this.storage.upload(filePath, this.selectedImage).snapshotChanges().pipe(
        finalize(() => (
          fileRef.getDownloadURL().subscribe((url) => {
            this.resep['image_url'] = url;
            this.resep['created_at']  = this.datePipe.transform(this.now, 'MMM d, y, h:mm:ss a');
            this.resep['author'] = this.dataUser.username;

            if(this.id != null) {
              if(!this.isAdmin) {
                this.resep['author'] = this.dataUser.username;
              }
              this.fire.collection('resep').doc(this.id).update(this.resep);
            } else {
              this.resep['author'] = this.dataUser.username;
              this.fire.collection('resep').add(this.resep);
            }
            this.loading = false;
            this.activeModal.close();
          })
        ))
      ).subscribe()
    }    
  }
}
