import { Component } from '@angular/core';
import {AlertController, App, NavController, NavParams, ToastController} from 'ionic-angular';
import {HttpService} from "../../services/httpService";
import {StorageService} from "../../services/storageService";
import {BarcodeScanner, BarcodeScannerOptions} from "@ionic-native/barcode-scanner";
import {File} from "@ionic-native/file";
import * as  echarts from 'echarts';
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
  lastDepartListData;
  departName;
  constructor(public navCtrl: NavController,public httpService:HttpService,public storageService:StorageService,
              public app:App,public navParams:NavParams,public barcodeScanner:BarcodeScanner, public alertCtrl:AlertController,
              public file:File,public toastCtrl:ToastController) {
    this.loadData();
  }
  ionViewDidEnter(){
    if (this.pageIndex==3){
      this.drawChart()
    }
  }
  loadData(){
    this.user=this.storageService.read("loginInfo")[0].user;
    this.user["depart"]=this.storageService.read("loginDepart");
    this.pageIndex = this.navParams.get("pageIndex");
    if(this.pageIndex==4){
      this.detail = this.navParams.get("detail")
    }
    this.departCode = this.user.depart.departcode;
    this.departName = this.user.depart.departname;
    if ((this.pageIndex==2||this.pageIndex==3)&&this.storageService.read("departListData")){
      this.departListData = this.storageService.read("departListData");
      this.lastDepartListData = this.departListData;
    }
    if (this.pageIndex==3){

    }
  }
  drawChart(){
    const ec = echarts as any;
    const container = document.getElementById('chart');
    console.log(container);
    const chart = ec.init(container);
    let option = {

      tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
          type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis : [
        {
          type : 'category',
          data : ['Mon', 'Tue'],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis : [
        {
          type : 'value'
        }
      ],
      series : [
        {
          name:'直接访问',
          type:'bar',
          barWidth: '60%',
          data:[{value:330,itemStyle:{color:'blue'}}, 220]
        }
      ]
    };
    chart.setOption(option);

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
      this.page=1;
      url = "cellPhoneController.do?queryLedgerList";
      if (!this.userPerson){
        this.userPerson = ""
      }
      body = {departCode:this.departCode,assetsType:this.assetsType,userPerson:this.userPerson,page:this.page,pageSize:this.pageSize};
      this.httpService.post(this.httpService.getUrl()+url,body).subscribe(data=>{
        console.log(data)
        if (data.success == "true"){
          this.detail = data.data;
          this.detail["count"] = data.count;
        }else {
          alert(data.msg)
        }
      })
    }else if (this.pageIndex == 3){
      url = "summaryController.do?querySummary"
    }

  }
  getMore(infiniteScroll){
    this.page++;
    let url,body;
    url = "cellPhoneController.do?queryLedgerList";
    if (!this.userPerson){
      this.userPerson = ""
    }
    body = {departCode:this.departCode,assetsType:this.assetsType,userPerson:this.userPerson,page:this.page,pageSize:this.pageSize};
    this.httpService.post(this.httpService.getUrl()+url,body).subscribe(data=>{
      console.log(data)
      if (data.success == "true"){
        for (let i in data.data){
          this.detail.push(data.data[i])
        }
      }else {
        alert(data.msg)
      }
      if (!data.data[0]){
        infiniteScroll.enable(false);
        let toast = this.toastCtrl.create({
          message: "这已经是最后一页了",
          duration: 2000,
        });
        toast.present();
      }
      infiniteScroll.complete();
    })
  }
  selectDepart(departName){
    this.departName = departName;
  }
  filterDepartName(ev: any) {
    const val = ev.target.value;
    let item = [];
    if (val && val.trim() != '') {
      for (let i in this.departListData){
        if(this.departListData[i]["departname"].indexOf(val)>=0){
          item.push(this.departListData[i])
        }
      }
    }
    else {
      item = this.departListData;
    }
    this.lastDepartListData = item;
    if (!item.length){
      this.departCode=""
    }
  }
  queryDetailPage(pageIndex,detail){
    this.app.getRootNav().push(QueryPage,{pageIndex:pageIndex,detail:detail})
  }
}
