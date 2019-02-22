import { Component } from '@angular/core';
import {AlertController, NavController, NavParams} from 'ionic-angular';
import {HttpService} from "../../services/httpService";
import {StorageService} from "../../services/storageService";

@Component({
  selector: 'page-base64',
  templateUrl: 'base64.html'
})
export class Base64Page {
  base64 = "";
  constructor(public navCtrl: NavController,public httpService:HttpService,public storageService:StorageService,
              public alertCtrl:AlertController,public navParams:NavParams) {
      this.base64 = this.navParams.get("base64");
  }
  ionViewDidEnter(){

  }
  returnPage(){
    this.navCtrl.pop();
  }
}
