import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MepPage } from './mep.page';
import {MepBoardSvgComponent} from './mep-board-svg/mep-board-svg.component';

const routes: Routes = [
  {
    path: 'svg',
    component: MepBoardSvgComponent
  },
  {
    path: ':id',
    component: MepPage
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MepPageRoutingModule {}
