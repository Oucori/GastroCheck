import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RestSettingsPage } from './rest-settings.page';

describe('RestSettingsPage', () => {
  let component: RestSettingsPage;
  let fixture: ComponentFixture<RestSettingsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestSettingsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RestSettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
