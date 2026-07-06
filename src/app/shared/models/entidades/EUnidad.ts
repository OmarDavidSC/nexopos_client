import { SPParse } from "src/app/utils/SPParse";

export class EUnidad {
    Id: any;
    Nombre: string;
    Abreviacion: string;
    Estado: string

    constructor() {
        this.Id = "";
        this.Nombre = "";
        this.Abreviacion = "";
        this.Estado = "";
    }

    public static parseJson(element: any): EUnidad {
        const objeto = new EUnidad();

        objeto.Id = SPParse.getNumber(element["id"]);
        objeto.Nombre = SPParse.getString(element["name"]);
        objeto.Abreviacion = SPParse.getString(element["abbreviation"]);
        objeto.Estado = SPParse.getString(element["status"]);
        return objeto;
    }

    public static parseJsonList(elements: any): EUnidad[] {

        const listado: EUnidad[] = [];
        if (elements != null) {
            Object.keys(elements).forEach(key => {
                const element = elements[key];
                const objeto: EUnidad = EUnidad.parseJson(element);
                listado.push(objeto);
            })
        }
        return listado;
    }
}