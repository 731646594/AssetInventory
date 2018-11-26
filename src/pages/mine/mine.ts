import { Component } from '@angular/core';
import {App, NavController} from 'ionic-angular';
import {HttpService} from "../../services/httpService";
import {StorageService} from "../../services/storageService";
import {ServiceSettingPage} from "../serviceSetting/serviceSetting";

@Component({
  selector: 'page-mine',
  templateUrl: 'mine.html'
})
export class MinePage {
  username;
  departname;
  constructor(public navCtrl: NavController,public httpService:HttpService,public storageService:StorageService,
              public app:App) {

  }
  ionViewDidEnter(){
    this.username=this.storageService.read("username");
    this.departname=this.storageService.read("departname");
  }
  serviceSetting(){
    this.app.getRootNav().push(ServiceSettingPage);
  }
  changePsw(){

  }
  changeDepart(){

  }
  reLogin(){

  }
  clearLocalData(){

  }
  downloadDictionaries(){

  }
}
