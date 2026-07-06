import { SPParse } from "src/app/utils/SPParse";

export class EMarca {
    Id: any;
    Nombre: string;
    Estado: string

    constructor() {
        this.Id = "";
        this.Nombre = "";
        this.Estado = "";
    }

    public static parseJson(element: any): EMarca {
        const objeto = new EMarca();

        objeto.Id = SPParse.getNumber(element["id"]);
        objeto.Nombre = SPParse.getString(element["name"]);
        objeto.Estado = SPParse.getString(element["status"]);
        return objeto;
    }

    public static parseJsonList(elements: any): EMarca[] {

        const listado: EMarca[] = [];
        if (elements != null) {
            Object.keys(elements).forEach(key => {
                const element = elements[key];
                const objeto: EMarca = EMarca.parseJson(element);
                listado.push(objeto);
            })
        }
        return listado;
    }
}