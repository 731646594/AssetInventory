import { Component } from '@angular/core';
import {App, LoadingController, NavController, NavParams} from 'ionic-angular';
import {HttpService} from "../../services/httpService";
import {StorageService} from "../../services/storageService";
import {FormPage} from "../form/form";
import {PlanListPage} from "../planList/planList";
import {CensorshipPage} from "../censorship/censorship";
import {SearchPage} from "../search/search";
import {PlanListLocalPage} from "../planListLocal/planListLocal";
import {QueryPage} from "../query/query";
import {GasStationManagementPage} from "../gasStationManagement/gasStationManagement";
import {GasStationUploadPage} from "../gasStationUpload/gasStationUpload";

@Component({
  selector: 'page-applyChoose',
  templateUrl: 'applyChoose.html'
})
export class ApplyChoosePage {
  user;
  choose;
  Data = [];
  constructor(public navCtrl: NavController,public httpService:HttpService,public storageService:StorageService,
              public navParams:NavParams,public app:App,public loadingCtrl:LoadingController) {
    this.loadData();

  }
  ionViewDidEnter(){

  }
  loadData(){
    this.user=this.storageService.read("loginInfo")[0].user;
    this.user["depart"]=this.storageService.read("loginDepart");
    this.choose = this.navParams.get("choose");
    if(this.choose == 5){
      let loading = this.loadingCtrl.create({
        content:"请等待...",
        duration: 10000
      });
      loading.present();
      this.httpService.post(this.httpService.getUrl()+"devWeeklyCheckController.do?getCheckListCols",{departCode:this.user["depart"]["departcode"]}).subscribe(data=>{
        if (data.success=="true"){
          this.Data.push(data.data);
          this.httpService.post(this.httpService.getUrl()+"devHandOverController.do?getCheckListCols",{departCode:this.user["depart"]["departcode"]}).subscribe(data2=>{
            if (data2.success=="true"){
              this.Data.push(data2.data);
              loading.dismiss();
            }else {
              alert(data2.msg);
              loading.dismiss();
            }
          });
        }else {
          alert(data.msg);
          loading.dismiss();
        }
      });
      this.storageService.createUserTable("zjb");
      this.storageService.createUserTable("jjb");
    }
  }
  formPage(pageIndex){
    this.app.getRootNav().push(FormPage,{pageIndex:pageIndex})
  }
  planListPage(pageIndex){
    this.app.getRootNav().push(PlanListPage,{pageIndex:pageIndex})
  }
  censorshipPage(pageIndex){
    this.app.getRootNav().push(CensorshipPage,{pageIndex:pageIndex})
  }
  searchPage(pageIndex){
    this.app.getRootNav().push(SearchPage,{pageIndex:pageIndex})
  }
  planListLocalPage(pageIndex){
    this.app.getRootNav().push(PlanListLocalPage,{pageIndex:pageIndex})
  }
  queryPage(pageIndex){
    this.app.getRootNav().push(QueryPage,{pageIndex:pageIndex})
  }
  gasPage(pageIndex){
    let Data=[];
    if (pageIndex==1){
      Data = this.Data[0]
    }else if (pageIndex==2){
      Data = this.Data[1]
    }
    this.app.getRootNav().push(GasStationManagementPage,{pageIndex:pageIndex,Data:Data})
  }
  uploadPage(pageIndex){
    this.app.getRootNav().push(GasStationUploadPage,{pageIndex:pageIndex})
  }
}
