import { Injectable } from '@angular/core';
import { Eusuario } from '../models/entidades/Eusuario';
import { ERol } from '../models/entidades/ERol';
import { ECompany } from '../models/entidades/ECompany';
import { ESucursal } from '../models/entidades/ESucursal';

@Injectable({
  providedIn: 'root'
})
export class AuthStoreService {

  constructor() { }

  private Usuario: Eusuario | null = null;
  private Rol: ERol | null = null;
  private Company: ECompany | null = null;
  private Branch: ESucursal | null = null;

  setUser(data: Eusuario) {
    this.Usuario = data;
  }

  getUser(): Eusuario | null {
    return this.Usuario;
  }

  deleteUser() {
    this.Usuario = null;
  }

  setRole(rol: ERol) {
    this.Rol = rol;
  }

  getRole(): ERol | null {
    return this.Rol;
  }

  deleteRole() {
    this.Rol = null;
  }

  setCompany(company: ECompany) {
    this.Company = company;
  }

  getCompany(): ECompany | null {
    return this.Company;
  }

  deleteCompany() {
    this.Company = null;
  }

  setBranch(branch: ESucursal) {
    this.Branch = branch;
  }

  getBranch(): ESucursal | null {
    return this.Branch;
  }

  deleteBranch() {
    this.Branch = null;
  }
}
