import { SPParse } from "src/app/utils/SPParse";

export class EProveedor {
    Id: any;
    NumeroDocumento: any;
    NombreEmpresa: string;
    Contacto: string;
    Telefono: number;
    Correo: string;
    Direccion: string;
    Estado: number;
    EstadoLabel: string

    constructor() {
        this.Id = "";
        this.NumeroDocumento = "";
        this.NombreEmpresa = "";
        this.Contacto = "";
        this.Telefono = 0;
        this.Correo = "";
        this.Direccion = "";
        this.Estado = 0;
        this.EstadoLabel = "";
    }

    public static parseJson(element: any): EProveedor {
        const objeto = new EProveedor();

        objeto.Id = SPParse.getNumber(element["id"]);
        objeto.NumeroDocumento = SPParse.getString(element["document_number"]);
        objeto.NombreEmpresa = SPParse.getString(element["business_name"]);
        objeto.Contacto = SPParse.getString(element["contact"]);
        objeto.Telefono = SPParse.getNumber(element["phone"]);
        objeto.Correo = SPParse.getString(element["email"]);
        objeto.Direccion = SPParse.getString(element["address"]);
        objeto.Estado = SPParse.getNumber(element["status"]);
        objeto.EstadoLabel = SPParse.getString(element["status_label"]);
        return objeto;
    }

    public static parseJsonList(elements: any): EProveedor[] {
        const listado: EProveedor[] = [];
        if (elements != null) {
            Object.keys(elements).forEach(key => {
                const element = elements[key];
                const objeto: EProveedor = EProveedor.parseJson(element);
                listado.push(objeto);
            })
        }
        return listado;
    }
}