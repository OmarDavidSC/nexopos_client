import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmProductosComponent } from './adm-productos.component';

describe('AdmProductosComponent', () => {
  let component: AdmProductosComponent;
  let fixture: ComponentFixture<AdmProductosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdmProductosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
