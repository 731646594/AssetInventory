import { Component } from '@angular/core';
import {ActionSheetController, AlertController, App, NavController, NavParams} from 'ionic-angular';
import {HttpService} from "../../services/httpService";
import {PageUtil, StorageService} from "../../services/storageService";
import {BarcodeScanner, BarcodeScannerOptions} from "@ionic-native/barcode-scanner";
import {Camera,CameraOptions} from "@ionic-native/camera";
import {File} from "@ionic-native/file";
import {PhotoViewer} from "@ionic-native/photo-viewer";

let that;
@Component({
  selector: 'page-form',
  templateUrl: 'form.html'
})
export class FormPage {
  pageIndex;
  user;
  isOnfocus=false;
  shape = "brief";
  radioButton = "资产条码";
  invoice=JSON;
  detail=[];
  i=0;
  departments;
  barCode;
  assetsCode;
  constructor(public navCtrl: NavController,public httpService:HttpService,public storageService:StorageService,
              public app:App,public alertCtrl:AlertController,public barcodeScanner:BarcodeScanner,
              public camera:Camera,public file:File,public photoViewer:PhotoViewer,
              public actionSheetCtrl:ActionSheetController,public navParams:NavParams) {
    that = this;
    this.loadData();
  }
  ionViewDidEnter(){
    // this.loadData();
  }
  loadData(){
    this.invoice=JSON.parse("{}");
    this.user=this.storageService.read("loginInfo")[0].user;
    this.user["depart"]=this.storageService.read("loginDepart");
    this.pageIndex = this.navParams.get("pageIndex");
    this.invoice["barCode"] = this.navParams.get("barCode");
    if (this.storageService.read("localPlan")){
      this.departments = this.storageService.read("localPlan")["departments"];
    }
    if (this.pageIndex==4&&this.departments){
      this.invoice["managerDepart"]=this.departments[0].departCode
    }
    let date = new Date();
    switch (this.pageIndex){
      case 1:
        this.invoice["assetsStatus"]="010101";
        this.invoice["realcodeStatus"]="0";
        this.invoice["technicalCondition"]="01";
        break;
      case 2:
        this.invoice["invoiceType"]="1401";
        this.invoice["inDepartcode"]="";
        this.invoice["sl"]=0;
        this.invoice["originalValue"]=0;
        this.invoice["nowValue"]=0;
        this.invoice["addDepreciate"]=0;
        this.invoice["createUserid"]=this.user.usercode;
        this.invoice["createTime"]=date.toLocaleDateString();
        this.invoice["createDepart"]=this.user.depart.shortname;
        break;
      case 3:
        this.invoice["discardTypeCode"]="020201";
        this.invoice["allotAmount"]=0;
        this.invoice["originalValue"]=0;
        this.invoice["nowValue"]=0;
        this.invoice["addDepreciate"]=0;
        this.invoice["devalueValue"]=0;
        this.invoice["departCode"]=this.user.depart.shortname;
        this.invoice["createuserid"]=this.user.username;
        this.invoice["createdate"]=date.toLocaleDateString();

        this.detail["stopDate"]=date.toLocaleDateString();
        this.detail["discardReasonCode"]="01";
        break;
      case 4:
        this.invoice["assetsStatus"]="010101";
        this.invoice["technicalCondition"]="01";
        break;
    }

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
        if (this.pageIndex==1){
          this.invoice["barCode"] = data.text;
          this.searchLocalPlanDetail();
        }else if (this.pageIndex==4){
          this.invoice["barCode"] = data.text;
        } else {
          this.detail["barCode"] = data.text;
        }
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
    let invoiceList = [];
    let isReplace = false;
    let willList = [];
    let willListLength=0;
    willList = this.storageService.read("willPlanDetail");
    willListLength=this.storageService.read("willPlanDetailLength");
    if(this.pageIndex==1){
      if (this.storageService.read("existPlanDetail")){
        invoiceList = this.storageService.read("existPlanDetail");
        for (let i in invoiceList){
          if (invoiceList[i]["barCode"] == this.invoice["barCode"]){
            invoiceList[i] = this.invoice;
            isReplace = true;
          }
        }
        if (!isReplace){
          for (let i in willList){
            if (willList[i]["barCode"] == this.invoice["barCode"]){
              willList.splice(Number(i),1);
              willListLength--;
            }
          }
          invoiceList.push(this.invoice)
        }
      }else {
        for (let i in willList){
          if (willList[i]["barCode"] == this.invoice["barCode"]){
            willList.splice(Number(i),1);
            willListLength--;
          }
        }
        invoiceList[0]=this.invoice;
      }
      this.storageService.write("willPlanDetail",willList);
      this.storageService.write("willPlanDetailLength",willListLength);
      PageUtil.pages["home"].inventoryNum = willListLength;
      this.storageService.write("existPlanDetail",invoiceList);
      let alertCtrl = this.alertCtrl.create({
        title:"保存成功！"
      });
      alertCtrl.present();
    }
    if (this.pageIndex==4){
      isReplace = false;
      invoiceList = [];
      if (this.storageService.read("newPlanDetail")){
        invoiceList = this.storageService.read("newPlanDetail");
        for (let i in invoiceList){
          if (invoiceList[i]["barCode"] == this.invoice["barCode"]){
            invoiceList[i] = this.invoice;
            isReplace = true;
          }
        }
        if (!isReplace){
          invoiceList.push(this.invoice)
        }
      }else {
        invoiceList[0]=this.invoice;
      }
      this.storageService.write("newPlanDetail",invoiceList);
      let alertCtrl = this.alertCtrl.create({
        title:"保存成功！"
      });
      alertCtrl.present();
    }
    if (this.pageIndex==2){
      this.storageService.write("allotInvoice",this.invoice);
      this.storageService.write("allotDetail",this.detail);
    }
    if (this.pageIndex==3){
      this.storageService.write("discardInvoice",this.invoice);
      this.storageService.write("discardDetail",this.detail);
    }
  }

  searchLocalPlanDetail(){
    let localPlanDetail = [];
    let isSearch = false;
    localPlanDetail = this.storageService.read("existPlanDetail");
    for(let i in  localPlanDetail){
      if (this.invoice["barCode"] == localPlanDetail[i]["barCode"]){
        this.invoice = localPlanDetail[i];
        isSearch = true;
      }
    }
    localPlanDetail = this.storageService.read("willPlanDetail");
    for(let i in  localPlanDetail){
      if (this.invoice["barCode"] == localPlanDetail[i]["barCode"]){
        this.invoice = localPlanDetail[i];
        isSearch = true;
      }
    }
    if (!isSearch){
      let alertCtrl = this.alertCtrl.create({
        title:"是否进入盘盈？",
        buttons:[
          {
            text:"是",
            handler:()=>{
              this.app.getRootNav().push(FormPage,{pageIndex:4,barCode:this.invoice["barCode"]})
            }
          },
          {
            text:"否"
          }
        ]
      });
      alertCtrl.present();
    }
  }
  searchDetail(){
    this.httpService.post(this.httpService.getUrl()+"discardController.do?queryByCodeOrBar",{userCode:this.user.usercode,departCode:this.user.depart.departcode,assetsCode:this.assetsCode,barCode:this.barCode}).subscribe(data=>{
      if (data.success=="true"){
        this.detail = data.data;
      }
      else {
        let alertCtrl = this.alertCtrl.create({
          title:data.msg
        });
        alertCtrl.present();
      }
    })
  }
  uploadData(){
    let url;
    if (this.pageIndex==2){
      url = "allotController.do?add"
    }else if (this.pageIndex==3){
      url = "discardController.do?add"
    }
    this.httpService.post(this.httpService.getUrl()+url,{departCode:this.user.depart.departcode,departName:this.user.depart.departname,userCode:this.user.usercode,userName:this.user.username,
      allotInvoiceDTO:this.invoice,eamDiscardInvoices:this.invoice,eamAllotDetal:this.detail,eamDiscardDetails:this.detail}).subscribe(data=>{
      if (data.success == "true"){
        let alertCtrl = this.alertCtrl.create({
          title:data.msg
        });
        alertCtrl.present()
      }
      else {
        alert(data.msg)
      }
    })
  }
  censorship(){
    let url;
    if (this.pageIndex == 2){
      url = "allotController.do?sendAllot"
    }else if (this.pageIndex == 3){
      url = "discardController.do?send"
    }
    let phoneInvoiceNumber = this.user.usercode+this.user.depart.departcode+this.formatDateAndTimeToString(new Date());
    this.httpService.post(this.httpService.getUrl()+url,{departCode:this.user.depart.departcode,userCode:this.user.usercode,phoneInvoiceNumber:phoneInvoiceNumber}).subscribe(data=>{
      if (data.success == "true"){
        let alertCtrl = this.alertCtrl.create({
          title:data.msg
        });
        alertCtrl.present()
      }
      else {
        alert(data.msg)
      }
    })
  }

  formatDateToString(date){
    if(!date){
      date = new Date();
    }
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var day = date.getDate();
    if(month<10) month = "0"+month;
    if(day<10) day = "0"+day;
    return year+""+month+""+day;
  }
  formatDateAndTimeToString(date)
  {
    var hours = date.getHours();
    var mins = date.getMinutes();
    var secs = date.getSeconds();
    if(hours<10) hours = "0"+hours;
    if(mins<10) mins = "0"+mins;
    if(secs<10) secs = "0"+secs;
    return this.formatDateToString(date)+""+hours+""+mins+""+secs;
  }
  uploadDataToEAM(){
    let url;
    if (this.pageIndex == 2){
      url = "allotController.do?confirm"
    }
    else if (this.pageIndex == 3){
      url = "discardController.do?confirm"
    }
    let phoneInvoiceNumber = this.user.usercode+this.user.depart.departcode+this.formatDateAndTimeToString(new Date());
    this.httpService.post(this.httpService.getUrl()+url,{departCode:this.user.depart.departcorde,phoneInvoiceNumber:phoneInvoiceNumber}).subscribe(data=>{
      if (data.success=="true"){
        let alertCtrl = this.alertCtrl.create({
          title:data.msg
        });
        alertCtrl.present()
      }
      else {
        alert(data.msg)
      }
    })
  }
}
