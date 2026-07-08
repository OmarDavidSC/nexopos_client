import { SPParse } from "src/app/utils/SPParse";

export class ECliente {
    Id: any;
    TipoDocumento: string;
    NumeroDocumento: any;
    NombreCliente: string;
    Telefono: any;
    Correo: string;
    Direccion: string;
    Estado: number;
    EstadoLabel: string;

    constructor() {
        this.Id = "";
        this.TipoDocumento = "";
        this.NumeroDocumento = 0;
        this.NombreCliente = "";
        this.Telefono = 0;
        this.Correo = "";
        this.Estado = 0;
        this.EstadoLabel = "";
    }

    public static parseJson(element: any): ECliente {
        const objeto = new ECliente();
        objeto.Id = SPParse.getNumber(element["id"]);
        objeto.TipoDocumento = SPParse.getString(element["document_type"]);
        objeto.NumeroDocumento = SPParse.getString(element["document_number"]);
        objeto.NombreCliente = SPParse.getString(element["name"]);
        objeto.Telefono = SPParse.getNumber(element["phone"]);
        objeto.Correo = SPParse.getString(element["email"]);
        objeto.Direccion = SPParse.getString(element["address"]);
        objeto.Estado = SPParse.getNumber(element["status"]);
        objeto.EstadoLabel = SPParse.getString(element["status_label"]);
        return objeto;
    }

    public static parseJsonList(elements: any): ECliente[] {
        const listado: ECliente[] = [];
        if (elements != null) {
            Object.keys(elements).forEach(key => {
                const element = elements[key];
                const objeto: ECliente = ECliente.parseJson(element);
                listado.push(objeto);
            })
        }
        return listado;
    }
}