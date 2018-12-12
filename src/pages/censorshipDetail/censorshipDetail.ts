import { Component } from '@angular/core';
import {AlertController, App, LoadingController, NavController, NavParams} from 'ionic-angular';
import {HttpService} from "../../services/httpService";
import {StorageService} from "../../services/storageService";

@Component({
  selector: 'page-censorshipDetail',
  templateUrl: 'censorshipDetail.html'
})
export class CensorshipDetailPage {
  user;
  pageIndex;
  invoice;
  postUrl;
  detailList;
  detail=[];
  isOnfocus=false;
  isAgree=1;
  isReasonModel=0;
  detailReason;
  constructor(public navCtrl: NavController,public httpService:HttpService,public storageService:StorageService,
              public app:App,public alertCtrl:AlertController,public navParams:NavParams,public loadingCtrl:LoadingController) {
    this.loadData();
  }
  ionViewDidEnter(){
    // this.loadData();
  }
  loadData(){
    this.user=this.storageService.read("loginInfo")[0].user;
    this.user["depart"]=this.storageService.read("loginDepart");
    this.pageIndex = this.navParams.get("pageIndex");
    this.invoice = this.navParams.get("invoice");
    switch (this.pageIndex){
      case 1:
        this.postUrl = "allotController.do?getByPhoneInvoiceNumber";
        break;
      case 2:
        this.postUrl = "allotController.do?getByPhoneInvoiceNumber";
        break;
      case 3:
        this.postUrl = "allotController.do?getByPhoneInvoiceNumber";
        break;
      case 4:
        this.postUrl = "discardController.do?getDetail";
        break;
      case 5:
        this.postUrl = "allotController.do?getByPhoneInvoiceNumber";
        break;
      case 6:
        this.postUrl = "discardController.do?getDetail";
        break;
    }
    let loading = this.loadingCtrl.create({
      content:"正在加载"
    });
    loading.present();
    this.httpService.post(this.httpService.getUrl()+this.postUrl,{departCode:this.user.depart.departcode,phoneInvoiceNumber:this.invoice.invoiceNumber,invoiceNumber:this.invoice.invoiceNumber}).subscribe(data=>{
      if (data.success == "true"){
        this.detailList = data.data;
      }else {
        alert(data.msg);
      }
      loading.dismiss();
    })
  }
  showDepartName(name){
    let  alert = this.alertCtrl.create({
      title:name
    });
    alert.present();
  }

  alertTextarea(){
    this.isReasonModel=1;
  }
  cancelReasonModel(){
    let alertCtrl = this.alertCtrl.create({
      title:"是否取消编辑原因？",
      buttons: [
        {
          text:'取消',
          handler:data=>{
            console.log("取消");
          }
        },
        {
          text:'确定',
          handler:data=>{
            this.isReasonModel=0;
          }

        }
      ]
    });
    alertCtrl.present();
  }
  clearReason(){
    let alertCtrl = this.alertCtrl.create({
      title:"是否取消清空编辑内容？",
      buttons: [
        {
          text:'取消',
          handler:data=>{
            console.log("取消");
          }
        },
        {
          text:'确定',
          handler:data=>{
            this.detailReason="";
          }

        }
      ]
    });
    alertCtrl.present();
  }
  saveReason(){
    this.isReasonModel=0;
  }
  inputOnfocus(){
    this.isOnfocus=true;
  }
  inputOnblur(){
    this.isOnfocus=false;
  }
  getDetail(pageIndex,detail,index){
    switch (pageIndex){
      case 1:
        this.detail = detail;
        break;
      case 2:
        this.checkedItem(index);
        break;
      case 3:
        this.checkedItem(index);
        break;
      case 5:
        this.detail = detail;
        break;
    }
  }
  postData(){

  }
  checkedItem(index){
    if (this.detailList[index].checked){
      document.getElementsByClassName("detailIcon")[index].setAttribute("style","color: #dedede;");
      this.detailList[index].checked = false;
      this.detail = [];
    }else {
      document.getElementsByClassName("detailIcon")[index].setAttribute("style","color: #0091d2;");
      this.detailList[index].checked = true;
      this.detail = this.detailList[index];
    }
  }
}
