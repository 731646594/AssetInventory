import { Component } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {HttpService} from "../../services/httpService";
import {StorageService} from "../../services/storageService";

@Component({
  selector: 'page-applyChoose',
  templateUrl: 'applyChoose.html'
})
export class ApplyChoosePage {
  user;
  choose;
  constructor(public navCtrl: NavController,public httpService:HttpService,public storageService:StorageService,
              public navParams:NavParams) {
    this.choose = this.navParams.get("choose");
    this.loadData();
  }
  ionViewDidEnter(){
    this.choose = this.navParams.get("choose");
    this.loadData();
  }
  loadData(){
    this.user=this.storageService.read("loginInfo")[0].user;
    this.user["depart"]=this.storageService.read("loginDepart");
  }
}
