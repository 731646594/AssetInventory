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
  planDetailList=[];
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
    this.pageIndex = this.navParams.get("pageIndex");
    if (this.pageIndex==1){
      this.planDetailList = this.storageService.read("localPlanDetail");
      this.planDetailListLength = this.storageService.read("localPlanDetailLength");
    }else {
      let newPlanDetail = [];
      let existPlanDetail = [];
      if (this.storageService.read("newPlanDetail")){
        newPlanDetail = this.storageService.read("newPlanDetail");
        for (let i in newPlanDetail){
          newPlanDetail[i]["planStatus"] = "new";
          this.planDetailList.push(newPlanDetail[i]);
        }
      }
      if (this.storageService.read("existPlanDetail")){
        existPlanDetail = this.storageService.read("existPlanDetail");
        for (let i in existPlanDetail){
          existPlanDetail[i]["planStatus"] = "exist";
          this.planDetailList.push(existPlanDetail[i]);
        }
      }
      console.log(this.planDetailList)
    }
  }
  planListLocalDetailPage(planDetail,pageIndex){
    if (this.pageIndex==1){
      this.app.getRootNav().push(PlanListLocalDetailPage,{planDetail:planDetail,pageIndex:pageIndex})
    }
  }
  uploadList(){
    let loadingCtrl = this.loadingCtrl.create({
      content:"正在加载"
    });
    loadingCtrl.present();
    this.httpService.post(this.httpService.getUrl()+"cellPhoneController.do?uploadcheckplan",{userCode:this.user.usercode,departCode:this.user.depart.departcode,uploadType:"",uploadFile:[],keyCode:"",data:""}).subscribe(data=>{
      loadingCtrl.dismiss();
      if (data.success=="true"){
        let alert = this.alertCtrl.create({
          title:data.msg
        });
        alert.present();
      }else {
        alert(data.msg)
      }
    })
  }
}
