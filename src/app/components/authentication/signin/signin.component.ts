import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FormHelper } from 'src/app/utils/form-helper';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  Form: FormGroup;
  Loading: boolean = false;
  hide: boolean = true;

  constructor(
    private toastr: ToastrService,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {

    this.Form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.router.navigate(['']);
    }

  }

  async login(): Promise<void> {

    if (this.Loading) return;
    if (!this.Form.valid) {
      FormHelper.ValidarFormGroup(this.Form);
      this.toastr.warning('Complete todos los campos obligatorios', 'Validación');
      return;
    }

    const item = this.Form.value;
    const formData = new FormData();
    formData.append('username', item.username);
    formData.append('password', item.password);
    this.Loading = true;
    try {
      const response = await this.authService.signin(formData);
      this.Loading = false;
      if (response.success) {
        localStorage.setItem('token', response.data.token);
        this.toastr.success(
          'Ha iniciado sesión correctamente',
          'Bienvenido'
        );
        setTimeout(() => {
          this.router.navigate(['']).then(() => {
            window.location.reload();
          });
        }, 1000);
      } else {
        this.toastr.error(response.message || 'Credenciales incorrectas', 'Error');
      }
    } catch (error: any) {
      this.Loading = false;
      this.toastr.error(error?.message || 'Ocurrió un error inesperado', 'Error');
    }

  }

  irRecuperarPassword(): void {
    this.router.navigate(['/forgot-password']);
  }
}
