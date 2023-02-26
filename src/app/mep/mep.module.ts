import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {MepPageRoutingModule} from './mep-routing.module';

import {MepPage} from './mep.page';
import {MepElementComponent} from "./mep-element/mep-element.component";
import {MepConnectionsComponent} from "./mep-connections/mep-connections.component";
import {MepBoardComponent} from "./mep-board/mep-board.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MepPageRoutingModule
  ],
  declarations: [
    MepPage,
    MepElementComponent,
    MepConnectionsComponent,
    MepBoardComponent
  ]
})
export class MepPageModule {
}
