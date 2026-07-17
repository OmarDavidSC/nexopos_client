import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ERol } from 'src/app/shared/models/entidades/ERol';
import { ECompany } from 'src/app/shared/models/entidades/ECompany';
import { Eusuario } from 'src/app/shared/models/entidades/Eusuario';
import { FormularioBase } from 'src/app/shared/pages/FormularioBase';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CompanyService } from 'src/app/shared/services/company.service';
import { AuthStoreService } from 'src/app/shared/stores/auth-store.service';

@Component({
  selector: 'app-panel-company',
  templateUrl: './panel-company.component.html',
  styleUrls: ['./panel-company.component.scss']
})
export class PanelCompanyComponent extends FormularioBase implements OnInit {

  UsuarioActual: Eusuario | null = null;
  Role: ERol | null = null;
  CompaniaActual: ECompany | null = null;

  Form!: FormGroup;

  Loading: boolean = false;
  Editando: boolean = false;
  BackupCompania: ECompany | null = null;

  LogoFile: File | null = null;
  FaviconFile: File | null = null;

  LogoPreview: string = '';
  FaviconPreview: string = '';

  Paises: any[] = [
    {
      codigo: 'PE',
      nombre: 'Perú',
      codigoMoneda: 'PEN',
      simboloMoneda: 'S/',
      nombreMoneda: 'Sol peruano'
    },
    {
      codigo: 'AR',
      nombre: 'Argentina',
      codigoMoneda: 'ARS',
      simboloMoneda: '$',
      nombreMoneda: 'Peso argentino'
    },
    {
      codigo: 'CL',
      nombre: 'Chile',
      codigoMoneda: 'CLP',
      simboloMoneda: '$',
      nombreMoneda: 'Peso chileno'
    },
    {
      codigo: 'CO',
      nombre: 'Colombia',
      codigoMoneda: 'COP',
      simboloMoneda: '$',
      nombreMoneda: 'Peso colombiano'
    },
    {
      codigo: 'EC',
      nombre: 'Ecuador',
      codigoMoneda: 'USD',
      simboloMoneda: '$',
      nombreMoneda: 'Dólar estadounidense'
    },
    {
      codigo: 'MX',
      nombre: 'México',
      codigoMoneda: 'MXN',
      simboloMoneda: '$',
      nombreMoneda: 'Peso mexicano'
    },
    {
      codigo: 'US',
      nombre: 'Estados Unidos',
      codigoMoneda: 'USD',
      simboloMoneda: '$',
      nombreMoneda: 'Dólar estadounidense'
    }
  ];

  constructor(
    public dialog: MatDialog,
    public route: ActivatedRoute,
    public router: Router,
    public spinner: NgxSpinnerService,
    public authService: AuthService,
    public companyService: CompanyService,
    public auhtStore: AuthStoreService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {
    super('panel-company', dialog, route, router, spinner);
  }

  ngOnInit(): void {
    this.crearFormulario();

    Promise.all([
      this.auhtStore.getUser(),
      this.auhtStore.getRole(),
      this.auhtStore.getCompany()
    ]).then(([resultadoUsuario, resultadoRole, resultadoCompany]) => {
      this.UsuarioActual = resultadoUsuario;
      this.Role = resultadoRole;
      this.CompaniaActual = resultadoCompany;
      const tienePermiso = this.validarPermisos(this.Role, ['administrator'], this.router, this.toastr);
      if (tienePermiso) {
        this.initialize();
      }
      // this.initialize();
    });
  }

  crearFormulario(): void {
    this.Form = this.formBuilder.group({
      name: ['', [Validators.required,Validators.maxLength(255)]],
      country_code: ['', [Validators.required]],
      currency_code: ['', [Validators.required, Validators.maxLength(10)]],
      currency_symbol: ['', [Validators.required,Validators.maxLength(10)]],
      currency_name: ['', [Validators.required,Validators.maxLength(100)]],
      terms_conditions: [''],
      privacy_policies: ['']
    });
    this.Form.disable();
  }

  async initialize(): Promise<void> {
    this.Loading = true;

    try {
      if (!this.CompaniaActual) {
        return;
      }

      this.Form.patchValue({
        name: this.CompaniaActual.Nombre,
        country_code: this.CompaniaActual.CodigoPais,
        currency_code: this.CompaniaActual.CodigoMoneda,
        currency_symbol: this.CompaniaActual.SimboloMoneda,
        currency_name: this.CompaniaActual.NombreMoneda,
        terms_conditions: this.CompaniaActual.TCondiciones,
        privacy_policies: this.CompaniaActual.PPolitica
      });

      this.LogoPreview = this.CompaniaActual.LogoUrl || '';
      this.FaviconPreview = this.CompaniaActual.IconoUrl || '';
    } finally {
      this.Loading = false;
    }
  }

  eventoEditar(): void {
    if (!this.CompaniaActual) {
      return;
    }

    this.BackupCompania = ECompany.parseJson({
      id: this.CompaniaActual.Id,
      name: this.CompaniaActual.Nombre,
      favicon_id: this.CompaniaActual.IconId,
      favicon_path: this.CompaniaActual.IconoUrl,
      logo_id: this.CompaniaActual.LogoId,
      logo_path: this.CompaniaActual.LogoUrl,
      status: this.CompaniaActual.Estado,
      privacy_policies: this.CompaniaActual.PPolitica,
      terms_conditions: this.CompaniaActual.TCondiciones,
      country_code: this.CompaniaActual.CodigoPais,
      currency_code: this.CompaniaActual.CodigoMoneda,
      currency_symbol: this.CompaniaActual.SimboloMoneda,
      currency_name: this.CompaniaActual.NombreMoneda
    });

    this.Editando = true;
    this.Form.enable();
  }

  eventoCancelar(): void {
    if (!this.BackupCompania) {
      return;
    }

    this.Form.patchValue({
      name: this.BackupCompania.Nombre,
      country_code: this.BackupCompania.CodigoPais,
      currency_code: this.BackupCompania.CodigoMoneda,
      currency_symbol: this.BackupCompania.SimboloMoneda,
      currency_name: this.BackupCompania.NombreMoneda,
      terms_conditions: this.BackupCompania.TCondiciones,
      privacy_policies: this.BackupCompania.PPolitica
    });

    this.LogoFile = null;
    this.FaviconFile = null;

    this.LogoPreview = this.BackupCompania.LogoUrl || '';
    this.FaviconPreview = this.BackupCompania.IconoUrl || '';

    this.Editando = false;
    this.Form.disable();
    this.Form.markAsPristine();
    this.Form.markAsUntouched();
  }

  eventoSeleccionarPais(codigoPais: string): void {
    const pais = this.Paises.find(item => item.codigo === codigoPais);

    if (!pais) {
      return;
    }

    this.Form.patchValue({
      currency_code: pais.codigoMoneda,
      currency_symbol: pais.simboloMoneda,
      currency_name: pais.nombreMoneda
    });
  }

  eventoSeleccionarLogo(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    if (!this.validarImagen(file)) {
      input.value = '';
      return;
    }

    this.LogoFile = file;
    this.generarPreview(file, 'logo');
  }

  eventoSeleccionarFavicon(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    if (!this.validarImagen(file)) {
      input.value = '';
      return;
    }

    this.FaviconFile = file;
    this.generarPreview(file, 'favicon');
  }

  validarImagen(file: File): boolean {
    const tiposPermitidos: string[] = ['image/png','image/jpeg','image/jpg','image/webp','image/x-icon','image/vnd.microsoft.icon'];
    const tamanioMaximo: number = 3 * 1024 * 1024;

    if (!tiposPermitidos.includes(file.type)) {
      this.toastr.warning('Seleccione una imagen PNG, JPG, WEBP o ICO.');
      return false;
    }

    if (file.size > tamanioMaximo) {
      this.toastr.warning('La imagen no debe superar los 3 MB.');
      return false;
    }

    return true;
  }

  generarPreview(file: File, tipo: 'logo' | 'favicon'): void {
    const reader = new FileReader();

    reader.onload = () => {
      const resultado = reader.result as string;

      if (tipo === 'logo') {
        this.LogoPreview = resultado;
      } else {
        this.FaviconPreview = resultado;
      }
    };

    reader.readAsDataURL(file);
  }

  eventoRemoverLogo(): void {
    this.LogoFile = null;
    this.LogoPreview = this.CompaniaActual?.LogoUrl || '';
  }

  eventoRemoverFavicon(): void {
    this.FaviconFile = null;
    this.FaviconPreview = this.CompaniaActual?.IconoUrl || '';
  }

  async eventoGuardar(): Promise<void> {
    if (!this.CompaniaActual || this.Loading) {
      return;
    }

    if (this.Form.invalid) {
      this.Form.markAllAsTouched();
      this.toastr.warning('Complete correctamente los campos obligatorios.');
      return;
    }

    this.Loading = true;
    this.spinner.show();

    try {
      const valores = this.Form.getRawValue();

      const formData = new FormData();

      formData.append('id', String(this.CompaniaActual.Id));
      formData.append('name', valores.name.trim());
      formData.append('country_code', valores.country_code);
      formData.append('currency_code', valores.currency_code.trim());
      formData.append('currency_symbol', valores.currency_symbol.trim());
      formData.append('currency_name', valores.currency_name.trim());
      formData.append('terms_conditions', valores.terms_conditions || '');
      formData.append('privacy_policies', valores.privacy_policies || '');

      if (this.LogoFile) {
        formData.append('logo', this.LogoFile, this.LogoFile.name);
      }

      if (this.FaviconFile) {
        formData.append('favicon', this.FaviconFile, this.FaviconFile.name);
      }

      const response = await this.companyService.update(formData);

      if (!response.success) {
        throw new Error(response.message);
      }

      this.actualizarCompaniaLocal(valores);

      this.Editando = false;
      this.Form.disable();
      this.Form.markAsPristine();

      this.LogoFile = null;
      this.FaviconFile = null;
      this.BackupCompania = null;

      this.toastr.success(
        response.message || 'Datos de la compañía actualizados correctamente.'
      );
    } catch (error: any) {
      this.toastr.error(
        error?.message || 'No se pudieron actualizar los datos de la compañía.'
      );
    } finally {
      this.Loading = false;
      this.spinner.hide();
    }
  }

  actualizarCompaniaLocal(valores: any): void {
    if (!this.CompaniaActual) {
      return;
    }

    this.CompaniaActual.Nombre = valores.name;
    this.CompaniaActual.CodigoPais = valores.country_code;
    this.CompaniaActual.CodigoMoneda = valores.currency_code;
    this.CompaniaActual.SimboloMoneda = valores.currency_symbol;
    this.CompaniaActual.NombreMoneda = valores.currency_name;
    this.CompaniaActual.TCondiciones = valores.terms_conditions;
    this.CompaniaActual.PPolitica = valores.privacy_policies;

    if (this.LogoPreview) {
      this.CompaniaActual.LogoUrl = this.LogoPreview;
    }

    if (this.FaviconPreview) {
      this.CompaniaActual.IconoUrl = this.FaviconPreview;
    }
  }

  get nombreEmpresa(): string {
    return this.Form?.get('name')?.value || this.CompaniaActual?.Nombre || 'Mi empresa';
  }

  get inicialEmpresa(): string {
    return this.nombreEmpresa.charAt(0).toUpperCase();
  }
}