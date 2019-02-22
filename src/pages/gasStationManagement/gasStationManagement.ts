import { Component } from '@angular/core';
import {ActionSheetController, AlertController, App, NavController, NavParams} from 'ionic-angular';
import {HttpService} from "../../services/httpService";
import {StorageService} from "../../services/storageService";
import {BarcodeScanner, BarcodeScannerOptions} from "@ionic-native/barcode-scanner";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {File} from "@ionic-native/file";
import {PhotoViewer} from "@ionic-native/photo-viewer";
import {SignaturePage} from "../signature/signature";
import {Base64Page} from "../base64/base64";
let that;
@Component({
  selector: 'page-gasStationManagement',
  templateUrl: 'gasStationManagement.html'
})
export class GasStationManagementPage {
  pageIndex;
  user;
  username;
  username2 = null;
  departCode;
  departName;
  gasStationCode;
  gasStationName;
  nowDataTime;
  detail=[];
  localData;
  departListData = null;
  departList = null;
  gasStationData = null;
  gasStation = null;
  colsData = null;
  isOnfocus = false;
  stationName = "";
  i = 0;
  signatureImage1 = '';
  signatureImage2 = '';
  temporaryStorageData=[];
  storageData={};
  signIndex;
  scanDepartCode = "";
  scanQybm = "";
  oldIndex = null;
  firstIn=true;
  // AssetInventoryDatabase:SQLiteObject;
  constructor(public navCtrl: NavController,public httpService:HttpService,public storageService:StorageService,
              public alertCtrl:AlertController,public navParams:NavParams,public barcodeScanner:BarcodeScanner,
              public actionSheetCtrl:ActionSheetController,public camera:Camera,public file:File,public photoViewer:PhotoViewer,
              public app:App) {
     this.loadData()
  }
  ionViewDidEnter(){
    that = this;
    if(this.pageIndex == 2){
      this.scanDepartCode = "";
      this.scanQybm = "";
      if (this.firstIn){
        this.showBlock();
        this.firstIn = false;
      }
    }
  }
  loadData(){
    this.user=this.storageService.read("loginInfo")[0].user;
    this.username = this.user.username;
    this.user["depart"]=this.storageService.read("loginDepart");
    this.pageIndex = this.navParams.get("pageIndex");
    this.departCode = this.user.depart.departcode;
    this.departName = this.user.depart.departname;
    let date = new Date();
    this.nowDataTime = new Date(date.getFullYear()+"-"+(date.getMonth()+1)+"-"+(date.getDate()+1)).toISOString();
    this.localData = this.navParams.get("Data");
    this.departListData = this.localData.fgsData;
    this.departList = this.departListData;
    let isEqual = true;
    for (let i in this.departList){
      if (this.departCode != this.departList[i].departcode){
        isEqual = false;
      }else {
        isEqual = true;
      }
    }
    if (!isEqual){
      this.departCode = this.departList[0].departcode;
      this.departName = this.departList[0].departname;
    }
    this.gasStationData = this.localData.jyzData;
    this.gasStation = this.gasStationData;
    isEqual = true;
    for (let i in this.departList){
      if (this.departCode != this.gasStation[i].departcode){
        isEqual = false;
      }else {
        isEqual = true;
      }
    }
    if (!isEqual){
      this.gasStationCode = this.gasStation[0].departcode;
      this.gasStationName = this.gasStation[0].departname;
    }else {
      this.gasStationCode = this.departCode;
      this.gasStationName = this.departName;
    }
    this.colsData = this.localData.colsData;
    this.storageData["uploadFile"]=[];

    // if (this.pageIndex == 2){
      // this.AssetInventoryDatabase = this.storageService.getUserTable();
      // this.queryUserTable("AssetInventoryTest")
    // }
  }
  // queryUserTable(tableName) {
  //   this.AssetInventoryDatabase.executeSql('SELECT * FROM '+tableName+';',[]).then(res =>{
  //     if (res.rows.length>0){
  //       this.signatureImage1 = res.rows.item(0).stringData;
  //       this.signatureImage2 = res.rows.item(1).stringData;
  //     }
  //   }).catch(e =>alert("erro2:"+JSON.stringify(e))  )
  // }
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
    this.departList = item;
  }
  selectDepart(departName){
    this.departName = departName;
  }
  filterStationName(ev: any) {
    const val = ev.target.value;
    let item = [];
    if (val && val.trim() != '') {
      for (let i in this.gasStationData){
        if(this.gasStationData[i]["departname"].indexOf(val)>=0){
          item.push(this.gasStationData[i])
        }
      }
    }
    else {
      item = this.gasStationData;
    }
    this.gasStation = item;
  }
  selectStation(departName){
    this.gasStationName = departName;
  }
  inputOnfocus(){
    this.isOnfocus=true;
  }
  inputOnblur(){
    this.isOnfocus=false;
  }
  controlField(i){
    let item = document.getElementById("field"+i).style.display;
    if (item == ""||item == "block"){
      item = "none";
    }else if (item == "none"){
      item = "block"
    }
    document.getElementById("field"+i).style.display = item;
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
        let scanText = [];
        scanText = data.text.split(",");
        this.scanDepartCode = scanText[0].split(":")[1];
        this.scanQybm = scanText[1].split(":")[1];
        this.beforeShow()
        // this.stationName = data.text;
        // if (this.pageIndex==1){
        //   this.invoice["barCode"] = data.text;
        //   this.searchLocalPlanDetail();
        // }else if (this.pageIndex==4){
        //   this.invoice["barCode"] = data.text;
        // } else {
        //   this.detail["barCode"] = data.text;
        // }
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
  pickPhoto(){
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: '拍摄照片',
          icon: 'camera',
          handler: () => {
            this.openCamera();
          }
        },
        {
          text: '从相册中选择照片',
          icon: 'images',
          handler: () => {
            this.openLibrary();
          }
        },
      ]
    });
    actionSheet.present();
  }
  openCamera() {
    const options: CameraOptions = {
      quality: 50,                                                   //相片质量 0 -100
      destinationType: this.camera.DestinationType.FILE_URI,        //DATA_URL 是 base64   FILE_URL 是文件路径
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: true,                                       //是否保存到相册
      sourceType: this.camera.PictureSourceType.CAMERA ,         //是打开相机拍照还是打开相册选择  PHOTOLIBRARY : 相册选择, CAMERA : 拍照,
      correctOrientation: true
    };

    this.camera.getPicture(options).then((imageData) => {
      this.resolveUri(imageData).then(url=>{
        url.file((file)=>{
          let reader = new FileReader();
          reader.onloadend=(e)=>{
            let node = document.getElementById("imgBox"+this.pageIndex);
            let base64Image=e.target['result'];
            let div = document.createElement("div");
            div.className = "imgInclusion";
            div.innerHTML+=
              "<img id=\"i"+this.i+"\" name=\"i"+this.i+"\" class=\"imgShow\" src=\""+base64Image+"\">" +
              "<img id=\"b"+this.i+"\" class=\"imgDeleteButton\" src='assets/imgs/delete.png'>";
            node.appendChild(div);
            this.storageData["uploadFile"].push(base64Image);
            document.getElementById("i"+that.i).onclick=function() {
              try {
                that.photoViewer.show(imageData)
              } catch (e) {
                alert(e)
              }
            };
            document.getElementById("b"+that.i).onclick=function(){
              try {
                node.removeChild(div);
              }catch(e) {
                alert(e)
              }
            };
            this.i++;
          };
          reader.readAsDataURL(file);
        },err=>{
          alert(err)
        });
      },err=>{
        alert(err)
      })
    }, (err) => {
      // Handle error
      alert(err)
    });
  }
  //图库
  openLibrary(){
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType:this.camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit: true,
      correctOrientation: true
    };

    this.camera.getPicture(options).then((imageData) => {
      this.resolveUri(imageData).then(url=>{
        url.file((file)=>{
          let reader = new FileReader();
          reader.onloadend=(e)=>{
            let node = document.getElementById("imgBox"+this.pageIndex);
            let base64Image=e.target['result'];
            let div = document.createElement("div");
            div.className = "imgInclusion";
            div.innerHTML+=
              "<img id=\"i"+this.i+"\" name=\"i"+this.i+"\" class=\"imgShow\" src=\""+base64Image+"\">" +
              "<img id=\"b"+this.i+"\" class=\"imgDeleteButton\" src='assets/imgs/delete.png'>";
            node.appendChild(div);
            this.storageData["uploadFile"].push(base64Image);
            document.getElementById("i"+that.i).onclick=function() {
              try {
                that.photoViewer.show(imageData)
              } catch (e) {
                alert(e)
              }
            };
            document.getElementById("b"+that.i).onclick=function(){
              try {
                node.removeChild(div);
              }catch(e) {
                alert(e)
              }
            };
            this.i++;
          };
          reader.readAsDataURL(file);
        },err=>{
          alert(err)
        });
      },err=>{
        alert(err)
      })
    }, (err) => {
      // Handle error
      alert(err)
    });
  }
  selectedChange(ev,index,index2){
    if (ev == "合格"){
      this.storageData["col"+(index*20+index2+1)]=ev;
      this.temporaryStorageData["col"+(index*20+index2+1)]="";
    }else if(ev == "其他情况"){
      this.temporaryStorageData["col"+(index*20+index2+1)]=ev;
      this.storageData["col"+(index*20+index2+1)]="";
    }
  }
  deleteImg(index){
    if (index==1){
      this.signatureImage1 = "";
    }else if(index==2){
      this.signatureImage2 = "";
    }
  }
  //转换url
  resolveUri(uri:string):Promise<any>{
    return new Promise((resolve, reject) => {
      this.file.resolveLocalFilesystemUrl(uri).then(filePath =>{
        resolve(filePath);
      }).catch(err =>{
        reject(err);
      });
    })
  }
  saveInfo(){
    if (this.pageIndex==1){
      console.log(this.colsData)
      for(let i = 0;i < this.colsData.length;i++){
        for (let j = 0;j < this.colsData[i].fields.length;j++){
          if(!this.storageData["col"+(i*20+j+1)]&&this.colsData[i].fields[j].columnRequire==1){
            let alertCtrl = this.alertCtrl.create({
              title:"有必填项未填！"
            });
            alertCtrl.present();
            return false;
          }
        }
      }
      if(this.departCode&&this.gasStationCode){
        this.storageData["zjrq"]=this.nowDataTime;
        this.storageData["zjry"]=this.username;
      }else {
        let alertCtrl = this.alertCtrl.create({
          title:"有必填项未填！"
        });
        alertCtrl.present();
        return false;
      }
    }else if(this.pageIndex==2){
      if (this.oldIndex!=null){
        for (let j=0;j<this.colsData[this.oldIndex].fields.length;j++){
          if (!this.storageData["col"+(this.oldIndex*20+j+1)]&&this.colsData[this.oldIndex].fields[j].columnRequire==1){
            let alertCtrl1 = this.alertCtrl.create({
              title:"有必填项未填!"
            });
            alertCtrl1.present();
            return false;
          }
        }
        if (document.getElementById("field"+this.oldIndex).style.display=="block"&&document.getElementById("checked"+this.oldIndex).style.display=="none"){
          document.getElementById("field"+this.oldIndex).style.display = "none";
          document.getElementById("checked"+this.oldIndex).style.display = "inline";
        }
      }else {
        let alertCtrl = this.alertCtrl.create({
          title:"有必填项未填！"
        });
        alertCtrl.present();
        return false;
      }
      if(this.departCode&&this.gasStationCode&&this.signatureImage1&&this.signatureImage2){
        this.storageData["jjbrq"]=this.nowDataTime;
        this.storageData["jiaobanry"]=this.username;
        this.storageData["jiebanry"]=this.username2;
        this.storageData["uploadFile"]=[];
        this.storageData["uploadFile"].push(this.signatureImage1);
        this.storageData["uploadFile"].push(this.signatureImage2);
      }else {
        let alertCtrl = this.alertCtrl.create({
          title:"有必填项未填！"
        });
        alertCtrl.present();
        return false;
      }
    }
    this.storageData["fgsbm"]=this.departCode;
    this.storageData["fgsmc"]=this.departName;
    this.storageData["yzbm"]=this.gasStationCode;
    this.storageData["yzmc"]=this.gasStationName;
    this.storageData = JSON.stringify(this.storageData);
    let tableName;
    if (this.pageIndex==1) {
      tableName = "zjb"
    }else {
      tableName = "jjb"
    }
    this.storageService.getUserTable().executeSql('SELECT * FROM '+tableName+' WHERE userCode=\''+this.user.usercode+'\';',[]).then(res =>{
      if (res.rows.length>0){
        this.storageService.updateUserTable(tableName,this.user.usercode,this.storageData);
      }else {
        this.storageService.insertIntoUserTable(tableName,this.user.usercode,this.storageData);
      }
      let alertCtrl = this.alertCtrl.create({
        title:"保存成功！"
      });
      alertCtrl.present();
      this.navCtrl.pop();
    }).catch(e =>alert("erro2:"+JSON.stringify(e))  )


  }
  myCallbackFunction  =(params) => {
    return new Promise((resolve, reject) => {

      if(typeof(params)!='undefined'){
        resolve('ok');
        if (this.signIndex==1){
          this.signatureImage1 = params;
        }else if(this.signIndex==2){
          this.signatureImage2 = params;
        }
      }else{

        reject(Error('error'))
      }

    });
  };

  signature(index){
    this.signIndex = index;
    this.app.getRootNav().push(SignaturePage,{callback:this.myCallbackFunction,pageIndex:index})
  }
  showSign(index){
    if (index == 1){
      this.app.getRootNav().push(Base64Page,{base64:this.signatureImage1});
    }else if(index == 2){
      this.app.getRootNav().push(Base64Page,{base64:this.signatureImage2});
    }
  }
  beforeShow(){
    if (this.oldIndex!=null){
      for (let j=0;j<this.colsData[this.oldIndex].fields.length;j++){
        if (!this.storageData["col"+(this.oldIndex*20+j+1)]&&this.colsData[this.oldIndex].fields[j].columnRequire==1){
          let alertCtrl1 = this.alertCtrl.create({
            title:"有必填项未填!"
          });
          alertCtrl1.present();
          return false;
        }
      }
      if (document.getElementById("field"+this.oldIndex).style.display=="block"&&document.getElementById("checked"+this.oldIndex).style.display=="none"){
        document.getElementById("field"+this.oldIndex).style.display = "none";
        document.getElementById("checked"+this.oldIndex).style.display = "inline";
      }
    }

    this.showBlock();

  }
  showBlock(){
    for (let i=0;i<this.colsData.length;i++){
      if(this.scanQybm == this.colsData[i].qybm&&this.scanDepartCode == this.user.depart.departcode){
        if (document.getElementById("field"+i).style.display=="none"&&document.getElementById("checked"+i).style.display=="inline"){
          let alertCtrl = this.alertCtrl.create({
            title:"该区域已检查！"
          });
          alertCtrl.present();
          return false;
        }
        if (document.getElementById("field"+i).style.display=="none"&&document.getElementById("checked"+i).style.display=="none"){
          document.getElementById("field"+i).style.display = "block";
        }
        // else if (document.getElementById("field"+i).style.display=="block"&&document.getElementById("checked"+i).style.display=="none"){
        //   document.getElementById("field"+i).style.display = "none";
        //   document.getElementById("checked"+i).style.display = "inline";
        // }
        // else if (document.getElementById("field"+i).style.display=="none"&&document.getElementById("checked"+i).style.display=="inline"){
        //   let alertCtrl = this.alertCtrl.create({
        //     title:"该区域已检查！"
        //   });
        //   alertCtrl.present();
        // }
        this.oldIndex = i;
      }else {
        document.getElementById("field"+i).style.display = "none";
      }
    }
  }
}
