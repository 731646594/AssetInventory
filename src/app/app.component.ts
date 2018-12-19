import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import {LoginPage} from "../pages/login/login";
import {StorageService} from "../services/storageService";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,storageService:StorageService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // statusBar.styleDefault();
      splashScreen.hide();
      //禁用返回键
      platform.registerBackButtonAction(() => {
        return;
      });
      if (storageService.read("loginInfo")&&storageService.read("loginDepart")){
        this.rootPage = TabsPage;
      }else {
        this.rootPage = LoginPage;
      }
    });
  }
}
