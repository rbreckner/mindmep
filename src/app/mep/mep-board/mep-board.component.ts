import {
  AfterViewInit,
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
  QueryList,
  ViewChildren
} from '@angular/core';
import {MepElementChangedEvent, MepElementComponent} from "../mep-element/mep-element.component";
import {MepService} from "../mep.service";
import {v4 as uuidv4} from "uuid";
import chroma from 'chroma-js';
import {windowDebug} from "../../../shared/helper";
import {MepElement, MepElementId} from "../types/mep-element";
import {MepConnection, MepConnectionId} from "../types/mep-connection";
import {
  CreateConnectionElement,
  createConnectionViewModels,
  MepConnectionViewModel
} from "../types/mep-connection-view-model";
import {MepTool} from "../types/mep-tool";

@Component({
  selector: 'mep-board',
  templateUrl: './mep-board.component.html',
  styleUrls: ['./mep-board.component.scss'],
})
export class MepBoardComponent implements AfterViewInit {
  connectionViewModels: MepConnectionViewModel[] | undefined;

  elementRefMap: { [id: string]: MepElementComponent } | undefined

  @ViewChildren(MepElementComponent) set elementRefs(elementRefs: QueryList<MepElementComponent>) {
    const elementRefMap: { [id: string]: MepElementComponent } = {}

    elementRefs.forEach(e => {
      if (e.element) {
        elementRefMap[e.element.id.toString()] = e;
      }
    })

    this.elementRefMap = elementRefMap;
  }

  movingEl: MepElement | null = null;
  private mouseClick: {
    x: number,
    y: number,
    left: number,
    top: number
  } | null = null;


  mousePosition: {
    left: number;
    top: number;
  } | null = null;

  // activeTool: MepTool = MepTool.createElement;

  get activeTool(): MepTool {
    if (this.movingEl) {
      return MepTool.move;
    } else if (this.mepService.editableElementId) {
      return MepTool.createConnection
    } else {
      return MepTool.createElement;
    }
  }

  @Input() elements: MepElement[] = [];

  @Input() connections: MepConnection[] = [];

  @Output() saveElements = new EventEmitter<MepElement[]>();
  @Output() saveConnections = new EventEmitter<MepConnection[]>();

  constructor(public mepService: MepService) {
    windowDebug('mepBoard', this);
  }

  ngAfterViewInit() {
    this.mapConnectionViewModels(100);
  }

  mapConnectionViewModels(ms = 0) {
    setTimeout(() => {
      let createConnectionElement: { [id: string]: CreateConnectionElement } = {}
      this.elements.forEach(el => {
        if (this.elementRefMap) {
          const rect = this.elementRefMap[el.id.toString()]
            ?.textDivRef?.nativeElement.getBoundingClientRect();
          if (rect) {
            createConnectionElement[el.id.toString()] = {el, rect};
          }
        }

      })
      this.connectionViewModels = createConnectionViewModels(
        createConnectionElement,
        this.connections
      );
    }, ms);
  }

  onElementMouseDown(event: MouseEvent, el: MepElement) {
    if (event.button === 0) {
      this.mouseClick = {
        x: event.clientX,
        y: event.clientY,
        left: el.x,
        top: el.y
      };
      this.movingEl = el;

      if (this.mepService.editableElementId) {
        this.createConnection(this.mepService.editableElementId, el.id);
        this.mepService.editableElementId = null;
      }
    }
  }


  onMouseMove(event: MouseEvent) {
    this.mousePosition = {
      left: event.clientX,
      top: event.clientY
    }

    if (this.movingEl && this.mouseClick) {
      this.movingEl.x = this.mouseClick.left + (event.clientX - this.mouseClick.x);
      this.movingEl.y = this.mouseClick.top + (event.clientY - this.mouseClick.y);

      this.mapConnectionViewModels();

      this.elements = [...this.elements];
      this.connections = [...this.connections];

    }
  }

  @HostListener('window:mouseup')
  onMouseUp(el: MepElement) {
    if (this.movingEl) {
      this.saveElements.emit(this.elements);
      this.movingEl = null;
    }
  }

  textChanged(event: MepElementChangedEvent, el: MepElement) {
    const {text, createNew} = event;
    if (text.trim()) {
      el.text = text;

      if (event.createNew) {

        const oldElementRef = this.elementRefMap?.[el.id.toString()];

        const rect = oldElementRef?.textDivRef?.nativeElement.getBoundingClientRect();
        if (rect) {
          const newElementId = this.createElement(
            rect.right + 20,
            rect.bottom - 56 + 20
          );
          this.createConnection(el.id, newElementId);
          // this.mepService.editableElementId = newElementId;
        }
      }

    } else {
      this.elements = this.elements.filter(x => x.id !== el.id);
      this.connections = this.connections.filter(x =>
        x.startNodeId !== el.id && x.endNodeId !== el.id
      )
    }
    this.mapConnectionViewModels();
    this.saveElements.emit(this.elements);
  }


  createElementByMouse(event: MouseEvent) {
    if (!this.mepService.editableElementId || event.shiftKey) {
      const headerCompensation = 56;
      const offset = 15;
      const newElementId = this.createElement(
        event.clientX - offset,
        event.clientY - headerCompensation - offset
      );
      if (this.mepService.editableElementId && event.shiftKey) {
        this.createConnection(this.mepService.editableElementId, newElementId);
      }
    }
  }

  createElement(x: number, y: number) {
    const newElement: MepElement = {
      id: uuidv4(),
      text: '',
      x,
      y,
      color: chroma.random()
        .set('hcl.c', 100)
        .set('hcl.l', 60)
        .hex()
    };
    this.elements = [
      ...this.elements,
      newElement
    ];
    this.mapConnectionViewModels();
    return newElement.id;
  }

  createConnection(startNodeId: MepElementId, endNodeId: MepElementId) {
    if (startNodeId === endNodeId) {
      return;
    }

    if (this.connections.some(x => {
      return x.startNodeId === startNodeId && x.endNodeId === endNodeId
    })) {
      return;
    }

    this.connections = [
      ...this.connections,
      {
        id: uuidv4(),
        startNodeId: startNodeId,
        endNodeId: endNodeId,
        firstLine: 'horizontal'
      }
    ];
    this.mapConnectionViewModels();
    this.saveConnections.emit(this.connections);
  }

  onConnectionClick(connectionId: MepConnectionId) {
    const connection = this.connections
      .find(x => x.id === connectionId);


    if (connection) {
      if (connection.firstLine === 'horizontal') {
        connection.firstLine = 'vertical'
      } else {
        connection.firstLine = 'horizontal'
      }
      this.connections = [
        ...this.connections.filter(x => x.id !== connectionId),
        connection
      ];
      this.mapConnectionViewModels();
      this.saveConnections.emit(this.connections);
    }

  }

  removeConnection(id: MepConnectionId) {
    console.log('remöve?')
    this.saveConnections.emit(this.connections.filter(c => c.id !== id))
    this.mapConnectionViewModels();
  }
}
