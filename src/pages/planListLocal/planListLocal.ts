import { Component } from '@angular/core';
import {AlertController, App, LoadingController, NavController, NavParams} from 'ionic-angular';
import {HttpService} from "../../services/httpService";
import {StorageService} from "../../services/storageService";
import {FileTransfer} from "@ionic-native/file-transfer";
import {File} from "@ionic-native/file";
import {PlanListLocalDetailPage} from "../planListLocalDetail/planListLocalDetail";

@Component({
  selector: 'page-planListLocal',
  templateUrl: 'planListLocal.html'
})
export class PlanListLocalPage {
  planDetailList;
  planDetailListLength;
  user;
  pageIndex;
  constructor(public navCtrl: NavController,public httpService:HttpService,public storageService:StorageService,
              public alertCtrl:AlertController,public loadingCtrl:LoadingController,public file:File,
              public fileTransfer:FileTransfer,public navParams:NavParams,public app:App) {
    this.loadData();
  }
  ionViewDidEnter(){
    // this.loadData();
  }
  loadData(){
    this.user=this.storageService.read("loginInfo")[0].user;
    this.user["depart"]=this.storageService.read("loginDepart");
    this.planDetailList = this.storageService.read("localPlanDetail");
    this.planDetailListLength = this.storageService.read("localPlanDetailLength");
  }
  planListLocalDetailPage(planDetail,pageIndex){
    this.app.getRootNav().push(PlanListLocalDetailPage,{planDetail:planDetail,pageIndex:pageIndex})
  }
}
