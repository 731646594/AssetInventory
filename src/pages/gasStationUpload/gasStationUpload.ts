import { Component } from '@angular/core';
import {AlertController, App, NavController, NavParams} from 'ionic-angular';
import {HttpService} from "../../services/httpService";
import {StorageService} from "../../services/storageService";

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
  itemName;
  checkedIndex;
  uploadList=new Array(2);
  constructor(public navCtrl: NavController,public httpService:HttpService,public storageService:StorageService,
              public alertCtrl:AlertController,public navParams:NavParams,public app:App) {
    this.user=this.storageService.read("loginInfo")[0].user;
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
      if (navParams.get("name")=="zjb"){
        this.itemName = "zjb";
      }else if (navParams.get("name")=="jjb"){
        this.itemName = "jjb";
      }
      this.item = navParams.get("data");
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
}
