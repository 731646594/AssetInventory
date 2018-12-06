import { Component } from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import {HttpService} from "../../services/httpService";
import {StorageService} from "../../services/storageService";

@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {
  agreement;
  address;
  port;
  serviceName;
  user;
  plan;
  departments;
  departCode;
  planStatus;
  existPlanDetail=[];
  willPlanDetail=[];
  newPlanDetail=[];
  planDetailList=[];
  existNum=0;
  willNum=0;
  newNum=0;
  constructor(public navCtrl: NavController,public httpService:HttpService,public storageService:StorageService,
              public alertCtrl:AlertController) {
    this.loadData();
  }
  ionViewDidEnter(){

  }
  loadData(){
    this.user=this.storageService.read("loginInfo")[0].user;
    this.user["depart"]=this.storageService.read("loginDepart");
    this.plan = this.storageService.read("localPlan");
    this.plan["username"]=this.user.username;
    this.plan.existNum = 0;
    this.plan.willNum = 0;
    this.plan.newNum = 0;
    this.departments = this.plan.departments;
    this.departCode = this.departments[0].departCode;
    console.log(this.departments)
    this.existPlanDetail = this.storageService.read("existPlanDetail");
    this.willPlanDetail = this.storageService.read("willPlanDetail");
    this.newPlanDetail = this.storageService.read("newPlanDetail");
    if(this.existPlanDetail)
      this.existNum = this.existPlanDetail.length;
    if(this.willPlanDetail)
      this.willNum = this.willPlanDetail.length;
    if(this.newPlanDetail)
      this.newNum = this.newPlanDetail.length;
  }
  readData(){
    if (this.planStatus=="exist"){
      this.planDetailList = this.existPlanDetail;
    }else if (this.planStatus=="will"){
      this.planDetailList = this.willPlanDetail;
    }else {
      this.planDetailList = this.newPlanDetail;
    }
  }
}
