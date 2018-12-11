import { Component } from '@angular/core';
import {AlertController, App, NavController, NavParams} from 'ionic-angular';
import {HttpService} from "../../services/httpService";
import {StorageService} from "../../services/storageService";
import {PlanListLocalDetailPage} from "../planListLocalDetail/planListLocalDetail";
import {CensorshipDetailPage} from "../censorshipDetail/censorshipDetail";

@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {
  pageIndex;
  agreement;
  address;
  port;
  serviceName;
  user;
  plan=JSON;
  departments;
  departCode;
  planStatus="";
  existPlanDetail=[];
  willPlanDetail=[];
  newPlanDetail=[];
  planDetailList;
  existNum=0;
  willNum=0;
  newNum=0;

  invoice=[];
  detail=[];
  constructor(public navCtrl: NavController,public httpService:HttpService,public storageService:StorageService,
              public alertCtrl:AlertController,public app:App,public navParams:NavParams) {
    this.loadData();
  }
  ionViewDidEnter(){

  }
  loadData(){
    this.user=this.storageService.read("loginInfo")[0].user;
    this.user["depart"]=this.storageService.read("loginDepart");
    this.pageIndex = this.navParams.get("pageIndex");
    if (this.pageIndex==1){
      if (this.storageService.read("localPlan")){
        this.plan = this.storageService.read("localPlan");
        this.plan["username"]=this.user.username;
        this.departments = this.plan["departments"];
        this.departCode = this.departments[0]["departCode"];
        this.planStatus = "will";
        this.selectDepart();
      }
    }else if (this.pageIndex==2||this.pageIndex==3){
      this.planStatus="invoice";
      this.invoice["invoiceStatus"]="0";
      this.invoice["invoiceYM"]=new Date().getFullYear()+"-"+(new Date().getMonth()+1);
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
  searchForm(){
    let url;
    if (this.pageIndex==2){
      url = "discardController.do?getInvoice"
    }else if (this.pageIndex==3){
      url = "allotController.do?getAllotInvoices"
    }
    if (!this.invoice["invoiceNumber"]){
      this.invoice["invoiceNumber"]="";
    }
    this.httpService.post(this.httpService.getUrl()+url,{departCode:this.user.depart.departcode,userCode:this.user.usercode,invoiceNumber:this.invoice["invoiceNumber"],invoiceStatus:this.invoice["invoiceStatus"],invoiceYM:this.invoice["invoiceYM"]}).subscribe(data=>{
      console.log(data)
      if (data.success=="true"){
        this.planDetailList=data.data;
      }else {
        alert(data.msg)
      }
    })
  }
  invoiceDetail(invoice,pageIndex){
    this.app.getRootNav().push(CensorshipDetailPage,{invoice:invoice,pageIndex:pageIndex})
  }

}
