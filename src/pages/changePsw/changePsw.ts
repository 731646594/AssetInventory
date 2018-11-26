import { Component } from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import {HttpService} from "../../services/httpService";
import {StorageService} from "../../services/storageService";

@Component({
  selector: 'page-changePsw',
  templateUrl: 'changePsw.html'
})
export class ChangePswPage {
  user;
  oldPsw;
  newPsw;
  confirmPsw;
  constructor(public navCtrl: NavController,public httpService:HttpService,public storageService:StorageService,
              public alertCtrl:AlertController) {
    this.loadData();
  }
  ionViewDidEnter(){
    this.loadData();
  }
  loadData(){
    this.user=this.storageService.read("loginInfo")[0].user;
    this.user["depart"]=this.storageService.read("loginDepart");
  }
  resetPsw(){
    if (!this.oldPsw){
      let alert=this.alertCtrl.create({
        title:"原密码不能为空！"
      });
      alert.present();
      return;
    }
    if (!this.newPsw){
      let alert=this.alertCtrl.create({
        title:"新密码不能为空！"
      });
      alert.present();
      return;
    }
    if (!this.confirmPsw){
      let alert=this.alertCtrl.create({
        title:"确认密码不能为空！"
      });
      alert.present();
      return;
    }
    this.httpService.post(this.httpService.getUrl()+"appLoginController.do?modifyPassword",
      {userid:this.user.usercode,password:this.oldPsw,passwordAgain:this.confirmPsw,passwordNew:this.newPsw}).subscribe((data)=>{
      console.log(data)
        if (data.success=="false"){
        let alert=this.alertCtrl.create({
          title:data.msg
        });
        alert.present();
        return;
      }else {
        let alert=this.alertCtrl.create({
          title:data.msg
        });
        alert.present();
        this.navCtrl.pop();
      }
    },err=>{
      console.log(err)
    })
  }
}
