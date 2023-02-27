import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {v4 as uuidv4} from "uuid";
import {Id} from "../../shared/helper";
import {MepElement} from "./types/mep-element";
import {MepConnection} from "./types/mep-connection";

export interface Mep {
  name: string;
  elements: MepElement[],
  connections: MepConnection[]
}

@Component({
  selector: 'mep-page',
  templateUrl: './mep.page.html',
  styleUrls: ['./mep.page.scss'],
})
export class MepPage implements OnInit {
  connectionDebug = false;

  mapId: string | undefined;

  mep: Mep | undefined;

  mepStorageKey: string | undefined;

  get win() {
    return window as any;
  }

  get connectionOverview() {
    return this.mep?.connections.map(c => {
      return {
        id: c.id,
        startNodeName: this.mep?.elements.find(e => c.startNodeId === e.id)?.text,
        endNodeName: this.mep?.elements.find(e => c.endNodeId === e.id)?.text,
        firstLine: c.firstLine
      }
    })
  }

  constructor(private route: ActivatedRoute) {
    this.win['uuidv4'] = uuidv4
    this.win['mep'] = this;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.mapId = params['id'];
      if (this.mapId) {
        this.mepStorageKey = `mep:${this.mapId}`;
        this.load();
      }
    })
  }

  load() {
    if (this.mepStorageKey && this.mapId) {
      const mepJSON = localStorage.getItem(this.mepStorageKey);
      if (mepJSON) {
        this.mep = JSON.parse(mepJSON);
      } else {
        this.mep = {
          name: this.mapId,
          elements: [
            {
              id: '2c40b25c-0e0c-4d5b-a8ed-6a3f746521d8',
              text: 'Geiler Scheiß',
              x: 50,
              y: 25,
              color: '#61ffc5'
            },
            {
              id: '008a45ac-b417-4d2a-b47b-eb902376b106',
              text: 'Anderes Gedöns',
              x: 250,
              y: 300,
              color: '#ff61f4'
            }
          ],
          connections: []
        };
      }
    }
  }

  saveElements(elements: MepElement[]) {
    if (this.mepStorageKey && this.mep) {
      const mep: Mep = {
        ...this.mep,
        elements
      };
      localStorage.setItem(this.mepStorageKey, JSON.stringify(mep));
      this.mep = mep;
    }
  }

  saveConnections(connections: MepConnection[]) {
    if (this.mepStorageKey && this.mep) {
      const mep: Mep = {
        ...this.mep,
        connections
      };
      localStorage.setItem(this.mepStorageKey, JSON.stringify(mep));
      this.mep = mep;
    }
  }

  removeConnection(id: Id<MepConnection>) {
    if (this.mep) {
      this.saveConnections(this.mep.connections.filter(x => x.id !== id))
    }
  }
}
