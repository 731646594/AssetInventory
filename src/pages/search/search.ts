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
  }
}
