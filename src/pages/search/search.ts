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
  plan=JSON;
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
    if (this.storageService.read("localPlan")){
      this.plan = this.storageService.read("localPlan");
      this.plan["username"]=this.user.username;
      this.departments = this.plan["departments"];
      this.departCode = this.departments[0]["departCode"];
      this.selectDepart();
    }
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
  selectDepart(){
    this.existPlanDetail = this.storageService.read("existPlanDetail");
    this.willPlanDetail = this.storageService.read("willPlanDetail");
    this.newPlanDetail = this.storageService.read("newPlanDetail");
    let item = [];
    for (let x in this.existPlanDetail){
      if (this.departCode == this.existPlanDetail[x]["managerDepart"]){
        item.push(this.existPlanDetail[x])
      }
    }
    this.existPlanDetail = item;
    item = [];
    for (let i in this.willPlanDetail){
      if (this.departCode == this.willPlanDetail[i]["managerDepart"]){
        item.push(this.willPlanDetail[i])
      }
    }
    this.willPlanDetail = item;
    item = [];
    for (let j in this.newPlanDetail){
      if (this.departCode == this.newPlanDetail[j]["managerDepart"]){
        item.push(this.newPlanDetail[j])
      }
    }
    this.newPlanDetail = item;
    console.log("exist："+this.existPlanDetail+"will:"+this.willPlanDetail+"new:"+this.newPlanDetail)
    if(this.existPlanDetail)
      this.existNum = this.existPlanDetail.length;
    if(this.willPlanDetail)
      this.willNum = this.willPlanDetail.length;
    if(this.newPlanDetail)
      this.newNum = this.newPlanDetail.length;
    this.plan["number"] = this.existNum+this.willNum+this.newNum;
    this.readData();
  }
  planListLocalDetailPage(planDetail,pageIndex){
    this.app.getRootNav().push(PlanListLocalDetailPage,{planDetail:planDetail,pageIndex:pageIndex})
  }
}
