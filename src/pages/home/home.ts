import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {HttpService} from "../../services/httpService";
import {StorageService} from "../../services/storageService";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  user;
  todoList=[];
  inventoryNum=0;
  constructor(public navCtrl: NavController,public httpService:HttpService,public storageService:StorageService) {
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
        for (let key in data.data[0]) {
          this.todoList.push([key,data.data[0][key]]);
        }
        console.log(this.todoList)
      }
    },err=>{
      console.log(err)
    })
  }
}
