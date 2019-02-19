import { Component } from '@angular/core';
import {AlertController, NavController, NavParams} from 'ionic-angular';
import {HttpService} from "../../services/httpService";
import {StorageService} from "../../services/storageService";

@Component({
  selector: 'page-gasStationUpload',
  templateUrl: 'gasStationUpload.html'
})
export class GasStationUploadPage {
  pageIndex;
  constructor(public navCtrl: NavController,public httpService:HttpService,public storageService:StorageService,
              public alertCtrl:AlertController,public navParams:NavParams) {
    this.pageIndex = navParams.get("pageIndex")
  }
  ionViewDidEnter(){

  }

}
