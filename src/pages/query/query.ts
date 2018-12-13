import { Component } from '@angular/core';
import {AlertController, App, NavController, NavParams} from 'ionic-angular';
import {HttpService} from "../../services/httpService";
import {StorageService} from "../../services/storageService";
import {BarcodeScanner, BarcodeScannerOptions} from "@ionic-native/barcode-scanner";
import {File} from "@ionic-native/file";
@Component({
  selector: 'page-query',
  templateUrl: 'query.html'
})
export class QueryPage {
  user;
  pageIndex;
  shape="detail";
  radioButton = '资产条码';
  detail=[];
  plan=[];
  isOnfocus=false;
  i;
  barCode;
  assetsCode;

  assetsType="0101";
  departCode;
  userPerson;
  page=1;
  pageSize=10;
  departListData;
  constructor(public navCtrl: NavController,public httpService:HttpService,public storageService:StorageService,
              public app:App,public navParams:NavParams,public barcodeScanner:BarcodeScanner, public alertCtrl:AlertController,
              public file:File) {
    this.loadData();
  }
  ionViewDidEnter(){
  }
  loadData(){
    this.user=this.storageService.read("loginInfo")[0].user;
    this.user["depart"]=this.storageService.read("loginDepart");
    this.pageIndex = this.navParams.get("pageIndex");
    this.departCode = this.user.depart.departcode;
    if (this.storageService.read("departListData")){
      this.departListData = this.storageService.read("departListData");
    }
  }
  inputOnfocus(){
    this.isOnfocus=true;
  }
  inputOnblur(){
    this.isOnfocus=false;
  }
  scan() {
    let options: BarcodeScannerOptions = {
      preferFrontCamera: false,//前置摄像头
      showFlipCameraButton: true,//翻转摄像头按钮
      showTorchButton: true,//闪关灯按钮
      prompt: '扫描中……',//提示文本
      // formats: 'QR_CODE',//格式
      orientation: 'portrait',//方向
      torchOn: false,//启动闪光灯
      resultDisplayDuration: 500,//显示扫描文本
      disableSuccessBeep: true // iOS and Android
    };
    this.barcodeScanner
      .scan(options)
      .then((data) => {
        this.barCode = data.text;
        // const alert = this.alertCtrl.create({
        //   title: 'Scan Results',
        //   subTitle: data.text,
        //   buttons: ['OK']
        // });
        // alert.present();
      })
      .catch((err) => {
        const alert = this.alertCtrl.create({
          title: 'Attention!',
          subTitle: err,
          buttons: ['Close']
        });
        alert.present();
      });
  }
  query(){
    let url,body;
    if (this.pageIndex == 1){
      url = "cellPhoneController.do?queryLedger";
      if (!this.barCode){
        this.barCode = ""
      }
      if (!this.assetsCode){
        this.assetsCode = ""
      }
      body = {departCode:this.user.depart.departcode,assetsCode:this.assetsCode,barCode:this.barCode};
      this.httpService.post(this.httpService.getUrl()+url,body).subscribe(data=>{
        console.log(data)
        if (data.success == "true"){
          this.detail = data.data[0];
          this.plan = data.listRecord;
        }else {
          alert(data.msg)
        }
      })
    }else if (this.pageIndex == 2){
      url = "cellPhoneController.do?queryLedgerList";
      if (!this.userPerson){
        this.userPerson = ""
      }
      body = {departCode:this.departCode,assetsType:this.assetsType,userPerson:this.userPerson,page:this.page,pageSize:this.pageSize};
      this.httpService.post(this.httpService.getUrl()+url,body).subscribe(data=>{
        console.log(data)
        if (data.success == "true"){

        }else {
          alert(data.msg)
        }
      })
    }else if (this.pageIndex == 3){
      url = "summaryController.do?querySummary"
    }

  }
}
