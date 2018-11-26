import { Component } from '@angular/core';
import {App, NavController} from 'ionic-angular';
import {HttpService} from "../../services/httpService";
import {StorageService} from "../../services/storageService";
import {ServiceSettingPage} from "../serviceSetting/serviceSetting";

@Component({
  selector: 'page-mine',
  templateUrl: 'mine.html'
})
export class MinePage {
  user;
  todoList=[];
  inventoryNum=0;
  constructor(public navCtrl: NavController,public httpService:HttpService,public storageService:StorageService,
              public app:App) {
    this.todoList=[];
    this.loadData();
  }
  ionViewDidEnter(){
    this.todoList=[];
    this.loadData();
  }
  loadData(){
    this.user=this.storageService.read("loginInfo")[0].user;
    this.user["depart"]=this.storageService.read("loginDepart");
    this.httpService.post(this.httpService.getUrl()+"toDoController.do?tododetailcounts", {userCode:this.user.usercode,departCode:this.user.depart.departcode}).subscribe((data)=>{
      if (data.success=="true"){
        let i=0;
        for (let key in data.data[0]) {
          this.todoList.push([key,data.data[0][key]]);
        }
        console.log(this.todoList)
      }
    },err=>{
      console.log(err)
    })
  }
  serviceSetting(){
    this.app.getRootNav().push(ServiceSettingPage);
  }
  changePsw(){

  }
  changeDepart(){

  }
  reLogin(){

  }
  clearLocalData(){

  }
  downloadDictionaries(){

  }
}
