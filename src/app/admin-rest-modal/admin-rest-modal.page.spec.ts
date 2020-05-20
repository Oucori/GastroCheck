import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AdminRestModalPage } from './admin-rest-modal.page';

describe('AdminRestModalPage', () => {
  let component: AdminRestModalPage;
  let fixture: ComponentFixture<AdminRestModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminRestModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminRestModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
