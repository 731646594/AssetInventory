import { Component } from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import {HttpService} from "../../services/httpService";
import {StorageService} from "../../services/storageService";

@Component({
  selector: 'page-serviceSetting',
  templateUrl: 'serviceSetting.html'
})
export class ServiceSettingPage {
  agreement;
  address;
  port;
  serviceName;
  constructor(public navCtrl: NavController,public httpService:HttpService,public storageService:StorageService,
              public alertCtrl:AlertController) {

  }
  ionViewDidEnter(){
    this.httpService.getUrl();
    this.readUrl();
  }
  readUrl(){
    let url = this.storageService.read("url");
    this.agreement = url["agreement"];
    this.address = url["address"];
    this.port = url["port"];
    this.serviceName = url["serviceName"];
  }
  saveServiceSetting(){
    this.httpService.setUrl(this.agreement,this.address,this.port,this.serviceName);
    let alert = this.alertCtrl.create({
      title:"保存成功！"
    });
    alert.present();
    this.readUrl();
  }
}
