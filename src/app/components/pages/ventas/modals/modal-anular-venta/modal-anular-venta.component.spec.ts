import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAnularVentaComponent } from './modal-anular-venta.component';

describe('ModalAnularVentaComponent', () => {
  let component: ModalAnularVentaComponent;
  let fixture: ComponentFixture<ModalAnularVentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalAnularVentaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAnularVentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
