import { Component } from '@angular/core';
import {AlertController, App, LoadingController, NavController, NavParams} from 'ionic-angular';
import {HttpService} from "../../services/httpService";
import {PageUtil, StorageService} from "../../services/storageService";
import {FileTransfer,FileTransferObject} from "@ionic-native/file-transfer";
import {File} from "@ionic-native/file";
import {PlanListLocalPage} from "../planListLocal/planListLocal";

@Component({
  selector: 'page-planList',
  templateUrl: 'planList.html'
})
export class PlanListPage {
  planList;
  user;
  pageIndex;
  lastIndex;
  constructor(public navCtrl: NavController,public httpService:HttpService,public storageService:StorageService,
              public alertCtrl:AlertController,public loadingCtrl:LoadingController,public file:File,
              public fileTransfer:FileTransfer,public navParams:NavParams,public app:App) {
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
    this.pageIndex = this.navParams.get("pageIndex");
    if (this.pageIndex==2){
      this.planList = [];
      this.planList[0] = this.storageService.read("localPlan");
      this.planList[0].departRange = "";
      for (let i = 0;i<this.planList[0].departments.length;i++){
        this.planList[0].departRange += this.planList[0].departments[i].departName+"，"
      }
      loading.dismiss();
    }else {
      this.httpService.post(this.httpService.getUrl()+"cellPhoneController.do?phonecheckplandownload",{userCode:this.user.usercode,departCode:this.user.depart.departcode}).subscribe(data=>{
        console.log(data)
        if (data.success == "true"){
          this.planList=data.data;
          if (this.storageService.read("localPlan")!=null){
            for (let i=0;i<=this.planList.length;i++){
              let plan = [];
              plan = this.planList[i];
              try {
                if (this.storageService.read("localPlan")["planNumber"]==plan["planNumber"]){
                  this.planList[i].isDownLoad=true;
                  this.lastIndex = i;
                }
              }catch {

              }
            }
          }
        }else {
          alert(data.msg)
        }
        loading.dismiss();
      });
    }
  }
  downLoadPlan1(index){
    let loading = this.loadingCtrl.create({
      content:"正在加载"
    });
    loading.present();
    this.storageService.write("localPlan",this.planList[index]);
    this.httpService.post(this.httpService.getUrl()+"cellPhoneController.do?phonecheckplandetail",{userCode:this.user.usercode,departCode:this.user.depart.departcode,planNumber:this.planList[index].planNumber,departCodeList:this.user.depart.departcode+","}).subscribe(data=>{
      if (data.success=="true"){
        this.storageService.write("localPlanDetail",data.data);
        this.storageService.write("willPlanDetail",data.data);
        this.storageService.write("localPlanDetailLength",data.data.length);
        PageUtil.pages["home"].inventoryNum = data.data.length;
        this.planList[this.lastIndex].isDownLoad=false;
        this.planList[index].isDownLoad=true;
        loading.dismiss();
      }
      else {
        alert(data.msg);
        loading.dismiss();
      }
    })
  }
  downLoadPlan(index){
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
    fileTransferNow.download(this.httpService.getUrl()+"",
      this.file.dataDirectory+this.planList[index].planNumber).then((entry)=>{
      if (timer) clearInterval(timer);
      loading.dismiss();
      this.storageService.write("JsonUrl",entry);
      this.planList[index].isDownLoad = true;
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
  planListLocalPage(){
    if (this.pageIndex==2){
      this.app.getRootNav().push(PlanListLocalPage)
    }
  }
}
