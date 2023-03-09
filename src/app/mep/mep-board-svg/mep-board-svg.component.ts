import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-mep-board-svg',
  templateUrl: './mep-board-svg.component.html',
  styleUrls: ['./mep-board-svg.component.scss']
})
export class MepBoardSvgComponent implements OnInit {
  data = {}

  // @ViewChild('mep') set mep(el: ElementRef<SVGElement>) {
  //   console.log(el)
  //   const link = d3.link(d3.curveNatural)
  //
  //   const multiLinkData = [
  //     {source: [250, 175], target: [480, 280]}
  //     // {source: [50,50], target: [175,50]},
  //     // {source: [50,50], target: [175,75]},
  //   ];
  //
  //   const path = d3.path();
  //   path.moveTo(250, 175);
  //   path.quadraticCurveTo(480, 175, 480, 280);
  //
  //   console.log('path', path.toString());
  //
  //   // d3.select(el.nativeElement)
  //   //   .append('path')
  //   //   .attr('d', path.toString())
  //   //   .attr('fill', 'none')
  //   //   .attr('stroke', 'white');
  // }

  path: string;


  constructor() {
    const path = d3.path();
    path.moveTo(250, 175);
    path.quadraticCurveTo(500, 175, 500, 270);
    this.path = path.toString();
  }

  ngOnInit() {
  }

}
