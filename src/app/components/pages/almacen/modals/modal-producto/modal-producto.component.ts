import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ToastConfirmComponent } from 'src/app/shared/components/toast-confirm/toast-confirm.component';
import { ToastLoadingComponent } from 'src/app/shared/components/toast-loading/toast-loading.component';
import { ECategoria } from 'src/app/shared/models/entidades/ECategoria';
import { EMarca } from 'src/app/shared/models/entidades/EMarca';
import { EUnidad } from 'src/app/shared/models/entidades/EUnidad';
import { ProductService } from 'src/app/shared/services/product.service';
import { FormHelper } from 'src/app/utils/form-helper';

@Component({
  selector: 'app-modal-producto',
  templateUrl: './modal-producto.component.html',
  styleUrls: ['./modal-producto.component.scss']
})
export class ModalProductoComponent implements OnInit {

  public TituloPopup: string;
  public TituloButton: string;
  public Form: FormGroup;

  Loading: boolean = false;
  LoadingToast: any;

  ListaCategorias: ECategoria[] = [];
  ListaMarcas: EMarca[] = [];
  ListaUnidades: EUnidad[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private productoService: ProductService,
    private spinnerService: NgxSpinnerService,
    public toastService: ToastrService,
    public dialogRef: MatDialogRef<ModalProductoComponent>,
    private dialog: MatDialog
  ) {

  }

  ngOnInit(): void {

    this.Loading = true;
    this.ListaCategorias = this.data.categorias;
    this.ListaMarcas = this.data.marcas;
    this.ListaUnidades = this.data.unidades;
    this.Loading = false;

    const producto = this.data.producto;
    const isEdit = !!producto;

    this.TituloPopup = producto ? 'Editar Producto' : 'Nuevo Producto';
    this.TituloButton = producto ? 'Actualizar' : 'Registrar';

    this.Form = this.formBuilder.group({
      id: new FormControl(producto?.Id, []),
      category_id: new FormControl(producto?.IdCategoria, [Validators.required]),
      brand_id: new FormControl(producto?.IdMarca, [Validators.required]),
      unit_id: new FormControl(producto?.IdUnidad, [Validators.required]),
      code: new FormControl(producto?.Codigo, [Validators.required]),
      name: new FormControl(producto?.Nombre, [Validators.required]),
      purchase_price: new FormControl(producto?.PrecioCompra, [Validators.required]),
      sale_price: new FormControl(producto?.PrecioVenta, [Validators.required])
    });
  }

  async eventoGuardar(): Promise<void> {
    if (this.Loading) return;
    if (!this.Form.valid) {
      FormHelper.ValidarFormGroup(this.Form);
      return;
    }

    const item = this.Form.value;
    const formData = new FormData();
    formData.append('id', item.id ?? '');
    formData.append('category_id', item.category_id);
    formData.append('brand_id', item.brand_id);
    formData.append('unit_id', item.unit_id);
    formData.append('code', item.code);
    formData.append('name', item.name);
    formData.append('purchase_price', item.purchase_price);
    formData.append('sale_price', item.sale_price);

    const confirmToast = this.toastService.show(
      this.Form.get('id')?.value ? '¿Deseas actualizar el producto?' : '¿Deseas registrar el producto?', 'Confirmación',
      { toastComponent: ToastConfirmComponent, positionClass: 'toast-center-center', disableTimeOut: true }
    );
    confirmToast.onAction.subscribe(async () => {
      this.toastService.clear();
      this.Loading = true;
      this.LoadingToast = this.toastService.show('Procesando todos los datos...', '',
        { toastComponent: ToastLoadingComponent, positionClass: 'toast-center-center', disableTimeOut: true, tapToDismiss: false, closeButton: false, enableHtml: true }
      );
      try {
        let response;
        if (this.Form.get('id')?.value) {
          response = await this.productoService.update(formData);
        } else {
          response = await this.productoService.store(formData);
        }
        this.Loading = false;
        this.toastService.clear();
        if (!this.Loading) {
          if (response.success) {
            this.toastService.success(response.message);
            this.dialogRef.close(true);
          } else {
            this.toastService.error(response.message);
          }
        }
      } catch (error: any) {
        this.Loading = false;
        this.toastService.clear();
        if (!this.Loading) {
          this.toastService.error(error);
        }
      }
    });
  }
}
