import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UsermanagerPage } from './usermanager.page';

describe('UsermanagerPage', () => {
  let component: UsermanagerPage;
  let fixture: ComponentFixture<UsermanagerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsermanagerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UsermanagerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
