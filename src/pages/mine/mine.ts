import { Component } from '@angular/core';
import {App, NavController} from 'ionic-angular';
import {HttpService} from "../../services/httpService";
import {StorageService} from "../../services/storageService";
import {ServiceSettingPage} from "../serviceSetting/serviceSetting";
import {LoginPage} from "../login/login";

@Component({
  selector: 'page-mine',
  templateUrl: 'mine.html'
})
export class MinePage {
  user;
  constructor(public navCtrl: NavController,public httpService:HttpService,public storageService:StorageService,
              public app:App) {
    this.loadData();
  }
  ionViewDidEnter(){
    this.loadData();
  }
  loadData(){
    this.user=this.storageService.read("loginInfo")[0].user;
    this.user["depart"]=this.storageService.read("loginDepart");
  }
  serviceSetting(){
    this.app.getRootNav().push(ServiceSettingPage);
  }
  changePsw(){

  }
  changeDepart(){
    this.app.getRootNav().push(LoginPage);
  }
  reLogin(){
    this.storageService.remove("loginInfo")
    this.app.getRootNav().push(LoginPage);
  }
  clearLocalData(){

  }
  downloadDictionaries(){

  }
}
