import {Component, ViewChild} from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import {HttpService} from "../../services/httpService";
import {StorageService} from "../../services/storageService";
import {SignaturePad} from "angular2-signaturepad/signature-pad";


@Component({
  selector: 'page-signature',
  templateUrl: 'signature.html'
})
export class SignaturePage {
  @ViewChild(SignaturePad) public signaturePad:SignaturePad;
  public signaturePadOptions: object={
    "minWidth":2,
    "canvasWidth":document.body.clientWidth,
    "canvasHeight": (document.body.clientHeight-130)
  };
  public signatureImage: string;
  constructor(public navCtrl: NavController,public httpService:HttpService,public storageService:StorageService,
              public alertCtrl:AlertController) {

  }
  ionViewDidEnter(){

  }
  drawComplete(){
    this.signatureImage = this.signaturePad.toDataURL();
    console.log(this.signatureImage);
  }
  canvasResize(){
    let canvas = document.querySelector("canvas");
    this.signaturePad.set("minWidth",1);
    this.signaturePad.set("canvasWidth",canvas.offsetWidth);
    this.signaturePad.set("canvasHeight",canvas.offsetHeight);
  }
  ngAfterViewInit(){
    this.signaturePad.clear();
    this.canvasResize();
  }
  drawClear(){
    this.signaturePad.clear();
  }
}
