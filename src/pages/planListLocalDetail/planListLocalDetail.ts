import { Component } from '@angular/core';
import {AlertController, LoadingController, NavController, NavParams} from 'ionic-angular';
import {HttpService} from "../../services/httpService";
import {StorageService} from "../../services/storageService";
import {FileTransfer} from "@ionic-native/file-transfer";
import {File} from "@ionic-native/file";

@Component({
  selector: 'page-planListLocalDetail',
  templateUrl: 'planListLocalDetail.html'
})
export class PlanListLocalDetailPage {
  planDetail;
  user;
  pageIndex;
  constructor(public navCtrl: NavController,public httpService:HttpService,public storageService:StorageService,
              public alertCtrl:AlertController,public loadingCtrl:LoadingController,public file:File,
              public fileTransfer:FileTransfer,public navParams:NavParams) {
    this.loadData();
  }
  ionViewDidEnter(){
    // this.loadData();
  }
  loadData(){
    this.user=this.storageService.read("loginInfo")[0].user;
    this.user["depart"]=this.storageService.read("loginDepart");
    this.planDetail = this.navParams.get("planDetail");
    console.log(this.planDetail.usedStateName)
    for (let key in this.planDetail){
      if (!this.planDetail[key]){
        this.planDetail[key]="-";
      }
    }
  }
}
