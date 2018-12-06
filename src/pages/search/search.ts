import { Component } from '@angular/core';
import {AlertController, App, NavController} from 'ionic-angular';
import {HttpService} from "../../services/httpService";
import {StorageService} from "../../services/storageService";
import {PlanListLocalDetailPage} from "../planListLocalDetail/planListLocalDetail";

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
              public alertCtrl:AlertController,public app:App) {
    this.loadData();
  }
  ionViewDidEnter(){

  }
  loadData(){
    this.user=this.storageService.read("loginInfo")[0].user;
    this.user["depart"]=this.storageService.read("loginDepart");
    this.plan = this.storageService.read("localPlan");
    this.plan["username"]=this.user.username;
    this.departments = this.plan.departments;
    this.departCode = this.departments[0].departCode;
    console.log(this.departments)
    this.existPlanDetail = this.storageService.read("existPlanDetail");
    this.willPlanDetail = this.storageService.read("willPlanDetail");
    console.log(this.willPlanDetail)
    this.newPlanDetail = this.storageService.read("newPlanDetail");
    if(this.existPlanDetail)
      this.existNum = this.existPlanDetail.length;
    if(this.willPlanDetail)
      this.willNum = this.willPlanDetail.length;
    if(this.newPlanDetail)
      this.newNum = this.newPlanDetail.length;
    this.plan["number"] = this.existNum+this.willNum+this.newNum;
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
  planListLocalDetailPage(planDetail,pageIndex){
    this.app.getRootNav().push(PlanListLocalDetailPage,{planDetail:planDetail,pageIndex:pageIndex})
  }
}
