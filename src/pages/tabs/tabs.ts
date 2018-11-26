import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { MinePage } from "../mine/mine";
import { ApplyPage } from "../apply/apply";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = ApplyPage;
  tab3Root = MinePage;

  constructor() {

  }
}
