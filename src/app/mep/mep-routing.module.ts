import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MepPage } from './mep.page';

const routes: Routes = [
  {
    path: ':id',
    component: MepPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MepPageRoutingModule {}
