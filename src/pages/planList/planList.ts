import { Component } from '@angular/core';
import {AlertController, LoadingController, NavController} from 'ionic-angular';
import {HttpService} from "../../services/httpService";
import {StorageService} from "../../services/storageService";
import {FileTransfer,FileTransferObject} from "@ionic-native/file-transfer";
import {File} from "@ionic-native/file";

@Component({
  selector: 'page-planList',
  templateUrl: 'planList.html'
})
export class PlanListPage {
  planList;
  user;
  fileContent;
  planUrl;
  constructor(public navCtrl: NavController,public httpService:HttpService,public storageService:StorageService,
              public alertCtrl:AlertController,public loadingCtrl:LoadingController,public file:File,
              public fileTransfer:FileTransfer) {
    this.loadData();
  }
  ionViewDidEnter(){
    // this.loadData();
  }
  loadData(){
    let loading = this.loadingCtrl.create({
      content:"正在加载"
    });
    loading.present();
    this.user=this.storageService.read("loginInfo")[0].user;
    this.user["depart"]=this.storageService.read("loginDepart");
    this.httpService.post(this.httpService.getUrl()+"cellPhoneController.do?phonecheckplandownload",{userCode:this.user.usercode,departCode:this.user.depart.departcode}).subscribe(data=>{
      if (data.success == "true"){
        this.planList=data.data;
      }else {
        alert(data.msg)
      }
      loading.dismiss();
    })
  }
  showPlanName(name){
    let  alert = this.alertCtrl.create({
      title:name
    });
    alert.present();
  }
  downLoadPlan(plan){
    const fileTransferNow: FileTransferObject = this.fileTransfer.create();
    //读取进度条
    let loading = this.loadingCtrl.create({
      content:"下载进度：0%",
      dismissOnPageChange:false,
    });
    loading.present();

    let  now: number = 0;

    fileTransferNow.onProgress(progressEvent=>{
      // alert(progressEvent.lengthComputable);
      if (progressEvent.lengthComputable){
        now = progressEvent.loaded/progressEvent.total*100;
      }
    });
    let timer = setInterval(()=>{
      loading.setContent("下载进度："+Math.floor(now)+"%");
      if (now >= 99){
        clearInterval(timer);
      }
    },300);
    //android 存储externalDataDirectory,通用沙盒存储dataDirectory
    fileTransferNow.download(this.planUrl,
      this.file.dataDirectory+plan.planNumber).then((entry)=>{
      if (timer) clearInterval(timer);
      loading.dismiss();
      this.storageService.write("JsonUrl",entry);
      plan.isDownLoad = true;
      alert("下载成功");
      // entry.file((file)=>{
      //   var reader = new FileReader();
      //   reader.onloadend=(e)=>{
      //     this.fileContent=e.target['result'];
      //     this.planList=JSON.parse(this.fileContent);
      //   };
      //   reader.readAsText(file);
      // })

    },(error)=>{
      alert("下载失败,error："+JSON.stringify(error));
      loading.dismiss();
    })
  }
}
