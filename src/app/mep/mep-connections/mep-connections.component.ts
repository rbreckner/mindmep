import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {windowDebug} from "../../../shared/helper";
import {MepConnectionId} from "../types/mep-connection";
import {MepConnectionViewModel} from "../types/mep-connection-view-model";
import {Event} from "@angular/router";

@Component({
  selector: 'mep-connections',
  templateUrl: './mep-connections.component.html',
  styleUrls: ['./mep-connections.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MepConnectionsComponent implements OnInit {
  @Input() connectionViewModels: MepConnectionViewModel[] | undefined;

  hoveredConnectionId: MepConnectionId | null = null;

  @Output() connectionClick = new EventEmitter<MepConnectionId>();
  @Output() connectionMiddleClick = new EventEmitter<MepConnectionId>();

  constructor() {
    windowDebug('mepConnections', this);
  }

  ngOnInit() {
  }

  changeConnectionDirection(event: MouseEvent, connection: MepConnectionViewModel) {
    event.stopPropagation();
    this.connectionClick.emit(connection.connectionId);
  }

  removeConnection(event: MouseEvent, connectionId: MepConnectionId) {
    event.preventDefault();
    console.log('benis', event)
    this.connectionMiddleClick.emit(connectionId);
  }
}
