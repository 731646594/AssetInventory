import { Component } from '@angular/core';
import {App, NavController} from 'ionic-angular';
import {HttpService} from "../../services/httpService";
import {StorageService} from "../../services/storageService";
import {ApplyChoosePage} from "../applyChoose/applyChoose";

@Component({
  selector: 'page-apply',
  templateUrl: 'apply.html'
})
export class ApplyPage {
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
  applyChoose(num){
    this.app.getRootNav().push(ApplyChoosePage,{choose:num})
  }
}
