import { SPParse } from "src/app/utils/SPParse";

export class ECategoria {
    Id: any;
    Nombre: string;
    Estado: string

    constructor() {
        this.Id = "";
        this.Nombre = "";
        this.Estado = "";
    }

    public static parseJson(element: any): ECategoria {
        const objeto = new ECategoria();

        objeto.Id = SPParse.getNumber(element["id"]);
        objeto.Nombre = SPParse.getString(element["name"]);
        objeto.Estado = SPParse.getString(element["status"]);
        return objeto;
    }

    public static parseJsonList(elements: any): ECategoria[] {

        const listado: ECategoria[] = [];
        if (elements != null) {
            Object.keys(elements).forEach(key => {
                const element = elements[key];
                const objeto: ECategoria = ECategoria.parseJson(element);
                listado.push(objeto);
            })
        }
        return listado;
    }
}