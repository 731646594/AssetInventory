import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { ServiceSettingPage } from "../pages/serviceSetting/serviceSetting";
import { LoginPage } from "../pages/login/login";
import { MinePage } from "../pages/mine/mine";
import { ApplyPage } from "../pages/apply/apply";
import { ChangePswPage } from "../pages/changePsw/changePsw";
import { ApplyChoosePage } from "../pages/applyChoose/applyChoose";
import { FormPage } from "../pages/form/form";
import { SignaturePage } from "../pages/signature/signature";
import { PlanListPage } from "../pages/planList/planList";
import { CensorshipPage } from "../pages/censorship/censorship";

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BarcodeScanner } from "@ionic-native/barcode-scanner";
import { Camera } from "@ionic-native/camera";
import { File } from "@ionic-native/file";
import { FileTransfer,FileTransferObject } from "@ionic-native/file-transfer";
import { PhotoViewer } from "@ionic-native/photo-viewer";
import { Network } from "@ionic-native/network";
import { HttpService } from "../services/httpService";
import { HttpModule } from "@angular/http";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { StorageService } from "../services/storageService";
import { SignaturePadModule } from "angular2-signaturepad";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TabsPage,
    LoginPage,
    ServiceSettingPage,
    MinePage,
    ApplyPage,
    ChangePswPage,
    ApplyChoosePage,
    FormPage,
    SignaturePage,
    PlanListPage,
    CensorshipPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    SignaturePadModule,
    IonicModule.forRoot(MyApp,{
      tabsHideOnSubPages: 'true' ,       //隐藏全部子页面tabs
      iconMode: 'ios',
      mode: 'ios',
      modalEnter: 'modal-slide-in',
      modalLeave: 'modal-slide-out',
      scrollAssist:false,
      autoFocusAssit:false,
      backButtonText: '返回',
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TabsPage,
    LoginPage,
    ServiceSettingPage,
    MinePage,
    ApplyPage,
    ChangePswPage,
    ApplyChoosePage,
    FormPage,
    SignaturePage,
    PlanListPage,
    CensorshipPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BarcodeScanner,
    Camera,
    File,
    FileTransfer,
    FileTransferObject,
    HttpClient,
    HttpService,
    PhotoViewer,
    Network,
    StorageService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
