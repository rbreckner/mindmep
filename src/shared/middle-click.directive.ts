import {Directive, Output, EventEmitter, HostListener} from '@angular/core';

@Directive({selector: '[middleclick]'})
export class MiddleclickDirective {
  @Output('middleclick') middleclick = new EventEmitter();

  constructor() {
  }

  @HostListener('mouseup', ['$event'])
  middleclickEvent(event: MouseEvent) {
    console.log('ev', event)
    if (event.button === 2) {
      this.middleclick.emit(event);
    }
  }
}
