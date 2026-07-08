import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerDetalleVentaComponent } from './ver-detalle-venta.component';

describe('VerDetalleVentaComponent', () => {
  let component: VerDetalleVentaComponent;
  let fixture: ComponentFixture<VerDetalleVentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerDetalleVentaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerDetalleVentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
