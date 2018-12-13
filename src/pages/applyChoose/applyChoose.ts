import { Component } from '@angular/core';
import {App, NavController, NavParams} from 'ionic-angular';
import {HttpService} from "../../services/httpService";
import {StorageService} from "../../services/storageService";
import {FormPage} from "../form/form";
import {PlanListPage} from "../planList/planList";
import {CensorshipPage} from "../censorship/censorship";
import {SearchPage} from "../search/search";
import {PlanListLocalPage} from "../planListLocal/planListLocal";
import {QueryPage} from "../query/query";

@Component({
  selector: 'page-applyChoose',
  templateUrl: 'applyChoose.html'
})
export class ApplyChoosePage {
  user;
  choose;
  constructor(public navCtrl: NavController,public httpService:HttpService,public storageService:StorageService,
              public navParams:NavParams,public app:App) {
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
  formPage(pageIndex){
    this.app.getRootNav().push(FormPage,{pageIndex:pageIndex})
  }
  planListPage(pageIndex){
    this.app.getRootNav().push(PlanListPage,{pageIndex:pageIndex})
  }
  censorshipPage(pageIndex){
    this.app.getRootNav().push(CensorshipPage,{pageIndex:pageIndex})
  }
  searchPage(pageIndex){
    this.app.getRootNav().push(SearchPage,{pageIndex:pageIndex})
  }
  planListLocalPage(pageIndex){
    this.app.getRootNav().push(PlanListLocalPage,{pageIndex:pageIndex})
  }
  queryPage(pageIndex){
    this.app.getRootNav().push(QueryPage,{pageIndex:pageIndex})
  }
}
