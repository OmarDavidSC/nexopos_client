import { SPParse } from "src/app/utils/SPParse";

export class ESucursal {
    Id: any;
    Nombre: string;
    Codigo: string;
    Telefono: string;
    Correo: string;
    Direccion: string;
    Estado: number
    EstadoLabel: string

    constructor() {
        this.Id = "";
        this.Nombre = "";
        this.Codigo = "";
        this.Telefono = "";
        this.Correo = "";
        this.Direccion = "";
        this.Estado = 0;
        this.EstadoLabel = "";
    }

    public static parseJson(element: any): ESucursal {
        const objeto = new ESucursal();

        objeto.Id = SPParse.getNumber(element["id"]);
        objeto.Nombre = SPParse.getString(element["name"]);
        objeto.Codigo = SPParse.getString(element["code"]);
        objeto.Telefono = SPParse.getString(element["phone"]);
        objeto.Correo = SPParse.getString(element["email"]);
        objeto.Direccion = SPParse.getString(element["address"]);
        objeto.Estado = SPParse.getNumber(element["status"]);
        objeto.EstadoLabel = SPParse.getString(element["status_label"]);
        return objeto;
    }

    public static parseJsonList(elements: any): ESucursal[] {
        const listado: ESucursal[] = [];
        if (elements != null) {
            Object.keys(elements).forEach(key => {
                const element = elements[key];
                const objeto: ESucursal = ESucursal.parseJson(element);
                listado.push(objeto);
            })
        }
        return listado;
    }
}