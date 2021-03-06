import { Component } from '@angular/core';
import {App, NavController} from 'ionic-angular';
import {HttpService} from "../../services/httpService";
import {PageUtil, StorageService} from "../../services/storageService";
import {FormPage} from "../form/form";
import {PlanListPage} from "../planList/planList";
import {CensorshipPage} from "../censorship/censorship";
import {SearchPage} from "../search/search";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  user;
  todoList=[];
  inventoryNum=0;
  num1;
  num2;
  num3;
  num4;
  num5;
  constructor(public navCtrl: NavController,public httpService:HttpService,public storageService:StorageService,
              public app:App) {
    this.loadData();
  }
  ionViewDidEnter(){
    this.loadData();
  }
  loadData(){
    PageUtil.pages["home"]=this;
    this.user=this.storageService.read("loginInfo")[0].user;
    this.user["depart"]=this.storageService.read("loginDepart");
    this.httpService.post(this.httpService.getUrl()+"toDoController.do?tododetailcounts", {userCode:this.user.usercode,departCode:this.user.depart.departcode}).subscribe((data)=>{
      this.todoList=[];
      if (data.success=="true"){
        for (let key in data.data[0]) {
          this.todoList.push([key,data.data[0][key]]);
        }
        if (this.storageService.read("willPlanDetailLength")){
          this.inventoryNum=this.storageService.read("willPlanDetailLength");
        }
        this.num1 = this.todoList[2][1];
        this.num2 = this.todoList[4][1];
        this.num3 = this.todoList[0][1];
        this.num4 = this.todoList[3][1];
        this.num5 = this.todoList[1][1];
      }
    },err=>{
      console.log(err)
    })
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
}
