import { Component } from '@angular/core';
import {AlertController, App, NavController} from 'ionic-angular';
import {HttpService} from "../../services/httpService";
import {StorageService} from "../../services/storageService";
import {ServiceSettingPage} from "../serviceSetting/serviceSetting";
import {TabsPage} from "../tabs/tabs";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  username;
  password;
  isLogin=false;
  depart;
  departList=[];
  constructor(public navCtrl: NavController,public httpService:HttpService,public alertCtrl:AlertController,
              public storageService:StorageService,public app:App) {
    this.loadData();
  }
  ionViewDidEnter(){

  }
  loadData(){
    if (this.storageService.read("loginInfo")){
      this.isLogin=true;
    }
    if (this.storageService.read("loginDepartList")) {
      this.departList = this.storageService.read("loginDepartList");
      this.depart = this.departList[0];
    }
  }
  login(){
    if (!this.username){
      let alert=this.alertCtrl.create({
        title:"用户名不能为空！"
      });
      alert.present();
      return;
    }
    if (!this.password){
      let alert=this.alertCtrl.create({
        title:"密码不能为空！"
      });
      alert.present();
      return;
    }
    this.httpService.post(this.httpService.getUrl()+"appLoginController.do?login",
      {usercode:this.username,password:this.password}).subscribe((data)=>{
      if (data.success=="false"){
        let alert=this.alertCtrl.create({
          title:data.msg
        });
        alert.present();
        return;
      }else {
        this.isLogin=true;
        let loginInfo = {};
        loginInfo = data.data;
        this.storageService.write("loginInfo",loginInfo);
        this.departList = loginInfo[1].depart;
        this.storageService.write("loginDepartList",this.departList);
        this.depart = this.departList[0];
      }
    },err=>{
      console.log(err)
    })
  }
  entry(){
    this.storageService.write("loginDepart",this.depart);
    this.app.getRootNav().push(TabsPage);
  }
  serviceSetting(){
    this.app.getRootNav().push(ServiceSettingPage);
  }
}
