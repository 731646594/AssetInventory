import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {HttpService} from "../../services/httpService";
import {StorageService} from "../../services/storageService";

@Component({
  selector: 'page-apply',
  templateUrl: 'apply.html'
})
export class ApplyPage {
  username;
  departname;
  constructor(public navCtrl: NavController,public httpService:HttpService,public storageService:StorageService) {

  }
  ionViewDidEnter(){
    this.username=this.storageService.read("username");
    this.departname=this.storageService.read("departname");
  }
  loadData(){

  }
}
