import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GenqrPage } from './genqr.page';

describe('GenqrPage', () => {
  let component: GenqrPage;
  let fixture: ComponentFixture<GenqrPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenqrPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GenqrPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
