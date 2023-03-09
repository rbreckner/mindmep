import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MepBoardSvgComponent } from './mep-board-svg.component';

describe('MepBoardSvgComponent', () => {
  let component: MepBoardSvgComponent;
  let fixture: ComponentFixture<MepBoardSvgComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MepBoardSvgComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MepBoardSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
