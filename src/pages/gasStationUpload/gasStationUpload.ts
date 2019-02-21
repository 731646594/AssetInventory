import { Component } from '@angular/core';
import {AlertController, App, LoadingController, NavController, NavParams} from 'ionic-angular';
import {HttpService} from "../../services/httpService";
import {StorageService} from "../../services/storageService";
import {PhotoViewer} from "@ionic-native/photo-viewer";

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
  checkedIndex;
  uploadList=new Array(2);
  colsItemName=[];
  photoArrary=[];
  signatureImage1;
  signatureImage2;
  constructor(public navCtrl: NavController,public httpService:HttpService,public storageService:StorageService,
              public alertCtrl:AlertController,public navParams:NavParams,public app:App,public loadingCtrl:LoadingController,
              public photoViewer:PhotoViewer) {
    this.user=this.storageService.read("loginInfo")[0].user;
    this.user["depart"]=this.storageService.read("loginDepart");
    this.pageIndex = navParams.get("pageIndex");
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
      this.photoArrary = this.item["uploadFile"];
      let photoLen = this.photoArrary.length;
      this.signatureImage1 = this.photoArrary[photoLen-2];
      this.signatureImage2 = this.photoArrary[photoLen-1];
      this.photoArrary.splice(photoLen-2,2);
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
    if ((this.checkedIndex||this.checkedIndex==0)&&this.checkedIndex!=index){
      document.getElementsByClassName("uploadIcon")[index].setAttribute("style","color: #0091d2;");
      this.uploadList[index].checked = true;
      document.getElementsByClassName("uploadIcon")[this.checkedIndex].setAttribute("style","color: #dedede;");
      this.uploadList[this.checkedIndex].checked = false;
      this.checkedIndex = index;
    }else {
      document.getElementsByClassName("uploadIcon")[index].setAttribute("style","color: #0091d2;");
      this.uploadList[index].checked = true;
      this.checkedIndex = index;
    }
  }
  detailPage(data,name){
    if(data.length!=0){
      this.app.getRootNav().push(GasStationUploadPage,{data:data,name:name,pageIndex:2})
    }
  }
  showSign(imgData){
    this.photoViewer.show(imgData);
  }
}
