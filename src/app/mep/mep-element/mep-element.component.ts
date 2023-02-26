import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {MepService} from "../../mep.service";
import {MepElement} from "../types/mep-element";

export interface MepElementChangedEvent {
  text: string;
  createNew: boolean;
}

@Component({
  selector: 'mep-element',
  templateUrl: './mep-element.component.html',
  styleUrls: ['./mep-element.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class MepElementComponent implements OnInit, AfterViewInit {
  @ViewChild('textDiv') textDivRef: ElementRef<HTMLDivElement> | undefined;

  @Input() element: MepElement | undefined;

  @Output() input = new EventEmitter<void>()
  @Output() textChanged = new EventEmitter<MepElementChangedEvent>();

  get textDivEl() {
    return this.textDivRef?.nativeElement;
  }

  get editable() {
    return this.mepService.editableElementId === this.element?.id;
  }


  constructor(private mepService: MepService) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // todo doesnt work with OnPush
    if (this.element?.text === '') {
      setTimeout(() => {
        this.enableTextEdit();
      });
    }
  }


  enableTextEdit() {
    if (this.textDivEl) {
      this.mepService.editableElementId = this.element?.id || null;
      selectElementContents(this.textDivEl);
    }
  }

  @HostListener('window:click')
  cancelEdit() {
    if (this.editable) {
      this.onTextChanged()
    }
  }

  // @HostListener('window:click')
  onTextChanged(command: string = '') {
    if (this.textDivEl) {
      const text = this.textDivEl.innerText;
      if (command === 'backspace' && text !== '') {
        return;
      }
      this.textDivEl.blur();
      this.textChanged.emit({
        text,
        createNew: command === 'createNew'
      });
      this.mepService.editableElementId = null;
    }
  }
}

function selectElementContents(el: HTMLDivElement) {
  setTimeout(() => {
    const range = document.createRange();
    range.selectNodeContents(el);
    const sel = window.getSelection();
    if (sel) {
      sel.removeAllRanges();
      sel.addRange(range);
    }
  });
}
