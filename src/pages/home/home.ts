import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {HttpService} from "../../services/httpService";
import {StorageService} from "../../services/storageService";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  user;
  constructor(public navCtrl: NavController,public httpService:HttpService,public storageService:StorageService) {
    this.user=this.storageService.read("loginInfo")[0].user;
    this.user["depart"]=this.storageService.read("loginDepart");
  }
  ionViewDidEnter(){
    this.user=this.storageService.read("loginInfo")[0].user;
    this.user["depart"]=this.storageService.read("loginDepart");
  }
}
