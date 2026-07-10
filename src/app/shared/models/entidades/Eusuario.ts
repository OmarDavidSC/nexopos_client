import { SPParse } from "src/app/utils/SPParse";


export class Eusuario {
    Id: any;
    Nombre: string;
    ApellidoPaterno: string;
    ApellidoMaterno: string;
    NombreCompleto: string;
    Usuario: string;
    Email: string;
    Foto: string;
    IdFoto: number;
    IdRol: number;
    NombreRol: string;
    IdSucursal: number;
    NombreSucursal: string;

    constructor() {
        this.Id = "";
        this.Nombre = "";
        this.ApellidoPaterno = "";
        this.NombreCompleto = "";
        this.Usuario = "";
        this.Email = "";
        this.Foto = "";
        this.IdFoto = 0;
        this.IdRol = 0;
        this.NombreRol = "";
        this.IdSucursal = 0;
        this.NombreSucursal = "";
    }

    public static parseJson(element: any): Eusuario {
        const objeto = new Eusuario();
        objeto.Id = SPParse.getNumber(element["id"]);
        objeto.Nombre = SPParse.getString(element["name"]);
        objeto.ApellidoPaterno = SPParse.getString(element["paternal_surname"]);
        objeto.ApellidoMaterno = SPParse.getString(element["maternal_surname"]);
        objeto.NombreCompleto = SPParse.getString(element["full_name"]);
        objeto.Usuario = SPParse.getString(element["username"]);
        objeto.Email = SPParse.getString(element["email"]);
        objeto.Foto = SPParse.getString(element["foto_path"]);
        objeto.IdFoto = SPParse.getNumber(element["foto_id"]);
        objeto.IdRol = SPParse.getNumber(element["role_id"]);
        objeto.NombreRol = SPParse.getString(element["role_name"]);
        objeto.IdSucursal = SPParse.getNumber(element["branch_id"]);
        objeto.NombreSucursal = SPParse.getString(element["branch_name"]);
        return objeto;
    }

    public static parseJsonList(elements: any): Eusuario[] {
        const listado: Eusuario[] = [];
        if (elements != null) {
            Object.keys(elements).forEach(key => {
                const element = elements[key];
                const objeto: Eusuario = Eusuario.parseJson(element);
                listado.push(objeto);
            })
        }
        return listado;
    }
}