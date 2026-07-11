import { SPParse } from "src/app/utils/SPParse";
import { Funciones } from "src/app/utils/Funciones";
import { EPermisos } from "./EPemisos";

export class ECompany {
    Id: any;
    Nombre: string;
    IconId: number;
    IconoUrl: string;
    LogoId: number;
    LogoUrl: string;
    Estado: any;
    PPolitica: any;
    TCondiciones: any;
    CodigoPais: string;
    CodigoMoneda: string;
    SimboloMoneda: string;
    NombreMoneda: string;

    constructor() {
        this.Id = "";
        this.Nombre = "";
        this.IconoUrl = "";
        this.LogoUrl = "";
        this.Estado = "";
        this.PPolitica = "";
        this.TCondiciones = "";
        this.CodigoPais = "";
        this.CodigoMoneda = "";
        this.SimboloMoneda = "";
        this.NombreMoneda = "";
    }

    public static parseJson(element: any): ECompany {
        const objeto = new ECompany();

        objeto.Id = SPParse.getNumber(element["id"]);
        objeto.Nombre = SPParse.getString(element["name"]);
        objeto.IconId = SPParse.getNumber(element["favicon_id"]);
        objeto.IconoUrl = SPParse.getString(element["favicon_path"]);
        objeto.LogoId = SPParse.getNumber(element["logo_id"]);
        objeto.LogoUrl = SPParse.getString(element["logo_path"]);
        objeto.Estado = SPParse.getNumber(element["status"]);
        objeto.PPolitica = SPParse.getString(element["privacy_policies"]);
        objeto.TCondiciones = SPParse.getString(element["terms_conditions"]);
        objeto.CodigoPais = SPParse.getString(element["country_code"]);
        objeto.CodigoMoneda = SPParse.getString(element["currency_code"]);
        objeto.SimboloMoneda = SPParse.getString(element["currency_symbol"]);
        objeto.NombreMoneda = SPParse.getString(element["currency_name"]);
        return objeto;
    }

    public static parseJsonList(elements: any): ECompany[] {
        const listado: ECompany[] = [];
        if (elements != null) {
            Object.keys(elements).forEach(key => {
                const element = elements[key];
                const objeto: ECompany = ECompany.parseJson(element);
                listado.push(objeto);
            })
        }
        return listado;
    }
}