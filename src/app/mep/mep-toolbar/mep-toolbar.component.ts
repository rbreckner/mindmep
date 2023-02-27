import {Component, Input, OnInit} from '@angular/core';
import {MepTool} from "../types/mep-tool";

@Component({
  selector: 'mep-toolbar',
  templateUrl: './mep-toolbar.component.html',
  styleUrls: ['./mep-toolbar.component.scss'],
})
export class MepToolbarComponent implements OnInit {
  @Input() activeTool: MepTool | undefined;
  MepTool = MepTool;

  constructor() {
  }

  ngOnInit() {
  }

}
