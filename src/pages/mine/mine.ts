import { Component } from '@angular/core';
import {AlertController, App, NavController} from 'ionic-angular';
import {HttpService} from "../../services/httpService";
import {StorageService} from "../../services/storageService";
import {ServiceSettingPage} from "../serviceSetting/serviceSetting";
import {LoginPage} from "../login/login";
import {ChangePswPage} from "../changePsw/changePsw";
@Component({
  selector: 'page-mine',
  templateUrl: 'mine.html'
})
export class MinePage {
  user;
  constructor(public navCtrl: NavController,public httpService:HttpService,public storageService:StorageService,
              public app:App,public alertCtrl:AlertController) {
    this.loadData();
  }
  ionViewDidEnter(){
    this.loadData();
  }
  loadData(){
    this.user=this.storageService.read("loginInfo")[0].user;
    this.user["depart"]=this.storageService.read("loginDepart");
  }
  serviceSetting(){
    this.app.getRootNav().push(ServiceSettingPage);
  }
  changePsw(){
    this.app.getRootNav().push(ChangePswPage);
  }
  changeDepart(){
    this.app.getRootNav().push(LoginPage);
  }
  reLogin(){
    this.storageService.remove("loginInfo");
    this.app.getRootNav().push(LoginPage);
  }
  clearLocalData(){

  }
  downloadDictionaries(){
    this.httpService.post(this.httpService.getUrl()+"allotController.do?getDeparts",{userCode:this.user.usercode}).subscribe(data1=>{
      console.log(data1)
      if (data1.success == "true"){
        this.storageService.write("departListData",data1.data);
        let alertCtrl = this.alertCtrl.create({
          title:"更新成功！"
        });
        alertCtrl.present();
      }else {
        alert(data1.msg)
      }
    });
    this.httpService.get(this.httpService.getUrl()+"dictionariesController.do?getPyyyDic",{}).subscribe(data2=> {
      if (data2.success == "success"){
        this.storageService.write("lossReasonData",data2.data);
      }
      else {
        alert(data2.msg)
      }
    });
    this.httpService.get(this.httpService.getUrl()+"dictionariesController.do?getCfddDic",{}).subscribe(data3=> {
      if (data3.success == "success"){
        this.storageService.write("storePlaceData",data3.data);
      }
      else {
        alert(data3.msg)
      }
    });
  }
}
