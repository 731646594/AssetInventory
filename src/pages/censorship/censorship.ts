import { Component } from '@angular/core';
import {AlertController, App, LoadingController, NavController, NavParams} from 'ionic-angular';
import {HttpService} from "../../services/httpService";
import {StorageService} from "../../services/storageService";

@Component({
  selector: 'page-censorship',
  templateUrl: 'censorship.html'
})
export class CensorshipPage {
  user;
  pageIndex;
  postUrl;
  censorshipList;
  checkedIndex = null;
  isAgree=1;
  isReasonModel=0;
  censorshipReason;
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
    switch (this.pageIndex){
      case 1:
        this.postUrl = "allotController.do?queryApproveInvoice";
        break;
      case 2:
        this.postUrl = "allotController.do?queryAllotOut";
        break;
      case 3:
        this.postUrl = "allotController.do?queryAllotIn";
        break;
      case 4:
        this.postUrl = "discardController.do?queryApproveInvoice";
        break;
    }
    let loading = this.loadingCtrl.create({
      content:"正在加载"
    });
    loading.present();
    this.httpService.post(this.httpService.getUrl()+this.postUrl,{departCode:this.user.depart.departcode,userCode:this.user.usercode}).subscribe(data=>{
      if (data.success == "true"){
        this.censorshipList = data.data;
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
  checkedItem(censorship,index){
    if ((this.checkedIndex||this.checkedIndex==0)&&this.checkedIndex!=index){
      document.getElementsByClassName("censorshipIcon")[index].setAttribute("style","color: #0091d2;");
      this.censorshipList[index].checked = true;
      document.getElementsByClassName("censorshipIcon")[this.checkedIndex].setAttribute("style","color: #dedede;");
      this.censorshipList[this.checkedIndex].checked = false;
      this.checkedIndex = index;
    }else {
      if (censorship.checked){
        document.getElementsByClassName("censorshipIcon")[index].setAttribute("style","color: #dedede;");
        this.censorshipList[index].checked = false;
        this.checkedIndex = null;
      }else {
        document.getElementsByClassName("censorshipIcon")[index].setAttribute("style","color: #0091d2;");
        this.censorshipList[index].checked = true;
        this.checkedIndex = index;
      }
    }

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
            this.censorshipReason="";
          }

        }
      ]
    });
    alertCtrl.present();
  }
  saveReason(){
    this.isReasonModel=0;
  }
  postData(){

  }
}
