import {Component, ViewChild} from '@angular/core';
import {AlertController, NavController, NavParams} from 'ionic-angular';
import {HttpService} from "../../services/httpService";
import {StorageService} from "../../services/storageService";
import {SignaturePad} from "angular2-signaturepad/signature-pad";
// import {SQLite, SQLiteObject} from "@ionic-native/sqlite";


@Component({
  selector: 'page-signature',
  templateUrl: 'signature.html'
})
export class SignaturePage {
  callback;
  @ViewChild(SignaturePad) public signaturePad:SignaturePad;
  public signaturePadOptions: object={
    "minWidth":2,
    "canvasWidth":document.body.clientWidth,
    "canvasHeight": (document.body.clientHeight-130)
  };
  public signatureImage: string;
  user;
  // AssetInventoryDatabase:SQLiteObject;
  isExist = false;
  pageIndex;
  constructor(public navCtrl: NavController,public httpService:HttpService,public storageService:StorageService,
              public alertCtrl:AlertController,public navParams:NavParams) {
    this.user=this.storageService.read("loginInfo")[0].user;
    this.callback=this.navParams.get("callback");
    this.pageIndex=this.navParams.get("pageIndex");
  }
  ionViewDidEnter(){
    // this.storageService.createUserTable("AssetInventoryTest");
    // this.AssetInventoryDatabase = this.storageService.getUserTable();
    // this.queryUserTable("AssetInventoryTest");
  }
  // queryUserTable(tableName) {
  //     this.AssetInventoryDatabase.executeSql('SELECT * FROM '+tableName+';',[]).then(res =>{
  //       if (res.rows.length>1){
  //         this.isExist = true;
  //       };
  //     }).catch(e =>alert("erro2:"+JSON.stringify(e))  )
  //   }
  drawComplete(){
    // this.signatureImage = this.signaturePad.toDataURL();
    // if (this.isExist){
    //   this.storageService.updateUserTable("AssetInventoryTest",this.user.usercode,this.signaturePad.toDataURL())
    // }else {
    //   this.storageService.insertIntoUserTable("AssetInventoryTest",this.user.usercode,this.signaturePad.toDataURL());
    // }
    let param = this.signaturePad.toDataURL();
    this.callback(param).then(()=>{
      this.navCtrl.pop();
    })
  }

  canvasResize(){
    let canvas = document.querySelector("canvas");
    this.signaturePad.set("minWidth",1);
    this.signaturePad.set("canvasWidth",canvas.offsetWidth);
    this.signaturePad.set("canvasHeight",canvas.offsetHeight);
  }
  ngAfterViewInit(){
    this.signaturePad.clear();
    this.canvasResize();
  }
  drawClear(){
    this.signaturePad.clear();
  }
}
