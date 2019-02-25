import { Component } from '@angular/core';
import {AlertController, App, LoadingController, NavController, NavParams} from 'ionic-angular';
import {HttpService} from "../../services/httpService";
import {StorageService} from "../../services/storageService";
import {PhotoViewer} from "@ionic-native/photo-viewer";
import {Base64Page} from "../base64/base64";

@Component({
  selector: 'page-gasStationUpload',
  templateUrl: 'gasStationUpload.html'
})
export class GasStationUploadPage {
  user;
  pageIndex;
  zjb=[];
  jjb=[];
  item=[];
  colItem=[];
  itemName;
  checkedArray=[false,false];
  colsItemName=[];
  photoArrary=[];
  photoShowArrary=[];
  signatureImage1;
  signatureImage2;
  constructor(public navCtrl: NavController,public httpService:HttpService,public storageService:StorageService,
              public alertCtrl:AlertController,public navParams:NavParams,public app:App,public loadingCtrl:LoadingController,
              public photoViewer:PhotoViewer) {
    this.user=this.storageService.read("loginInfo")[0].user;
    this.user["depart"]=this.storageService.read("loginDepart");
    this.pageIndex = navParams.get("pageIndex");
    this.itemName = null;
    this.photoArrary = [];
    if (this.pageIndex==1){
      this.storageService.getUserTable().executeSql('SELECT * FROM zjb WHERE userCode=\''+this.user.usercode+'\';',[]).then(res =>{
        if (res.rows.length>0){
          this.zjb = JSON.parse(res.rows.item(0).stringData);
        }
      }).catch(e =>alert("erro21:"+JSON.stringify(e))  );
      this.storageService.getUserTable().executeSql('SELECT * FROM jjb WHERE userCode=\''+this.user.usercode+'\';',[]).then(res =>{
        if (res.rows.length>0){
          this.jjb = JSON.parse(res.rows.item(0).stringData);
        }
      }).catch(e =>alert("erro22:"+JSON.stringify(e))  )
    }
    else if (this.pageIndex==2){
      let url;
      if (navParams.get("name")=="zjb"){
        this.itemName = "zjb";
        url = "devWeeklyCheckController.do?getCheckListCols";
      }else if (navParams.get("name")=="jjb"){
        this.itemName = "jjb";
        url = "devHandOverController.do?getCheckListCols";
      }
      this.item = navParams.get("data");
      for(let i in this.item){
        if (i.indexOf("col")!=-1){
          this.colItem.push(this.item[i])
        }
      }
      if (this.itemName=="jjb") {
        this.photoArrary = this.item["uploadFile"];
        let photoLen = this.photoArrary.length;
        this.signatureImage1 = this.photoArrary[photoLen - 2];
        this.signatureImage2 = this.photoArrary[photoLen - 1];
        for(let i = 0;i<photoLen-2;i++){
          this.photoShowArrary[i] = this.photoArrary[i]
        }
      }

      let loading = this.loadingCtrl.create({
        content:"请等待...",
        duration: 10000
      });
      loading.present();
      this.httpService.post(this.httpService.getUrl()+url,{departCode:this.user["depart"]["departcode"]}).subscribe(data=>{
        if (data.success=="true"){
          let colsData = data.data.colsData;
          for (let i in colsData){
            for (let j in colsData[i]["fields"]){
              this.colsItemName.push(colsData[i]["fields"][j].columnTitle)
            }
          }
          loading.dismiss();
        }else {
          alert(data.msg);
          loading.dismiss();
        }
      });

    }
  }
  ionViewDidEnter(){

  }
  checkedItem(index){
    if (this.checkedArray[index]==false){
      document.getElementsByClassName("uploadIcon")[index].setAttribute("style","color: #0091d2;");
      this.checkedArray[index]=true;
    }else {
      document.getElementsByClassName("uploadIcon")[index].setAttribute("style","color: #dedede;");
      this.checkedArray[index]=false;
    }
  }
  detailPage(data,name){
    if(data.length!=0){
      this.app.getRootNav().push(GasStationUploadPage,{data:data,name:name,pageIndex:2})
    }
  }
  showSign(imgData){
    this.app.getRootNav().push(Base64Page,{base64:imgData});
  }
  uploadGasInfo(){
    if (this.checkedArray[0]){
      this.uploading("devWeeklyCheckController.do?saveCheckForm",this.zjb,"zjb")
    }
    if (this.checkedArray[1]){
      this.uploading("devHandOverController.do?saveCheckForm",this.jjb,"jjb")
    }
    let alertCtrl = this.alertCtrl.create({
      title:"上传成功！"
    });
    alertCtrl.present();
  }
  uploading(url,data,name){
    this.httpService.post(this.httpService.getUrl()+url,{userCode:this.user.usercode,userName:this.user.username,userDepart:this.user["depart"]["departcode"],userDepartName:this.user.depart.departname,data:data,uploadFile:data["uploadFile"]}).subscribe(data=>{
      if (data.success=="true"){
        if(name=="zjb"){
          this.zjb=null;
          this.storageService.deleteUserTable("zjb");
        }else {
          this.jjb=null;
          this.storageService.deleteUserTable("jjb");
        }
      }else{
        alert(data.msg)
      }
    })
  }
}
