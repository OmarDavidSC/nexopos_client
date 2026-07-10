import { SPParse } from "src/app/utils/SPParse";

export class EProductStock {
    Id: number;
    IdProducto: number;
    Codigo: string;
    Nombre: string;
    NombreCategoria: string;
    NombreMarca: string;
    NombreUnidad: string;
    StockActual: number;
    StockMinimo: number;
    EstadoStock: string;
    ColorStock: string;

    constructor() {
        this.Id = 0;
        this.IdProducto = 0;
        this.Codigo = "";
        this.Nombre = "";
        this.NombreCategoria = "";
        this.NombreMarca = "";
        this.NombreUnidad = "";
        this.StockActual = 0;
        this.StockMinimo = 0;
        this.EstadoStock = "";
        this.ColorStock = "";
    }

    public static parseJson(element: any): EProductStock {
        const objeto = new EProductStock();
        objeto.Id = SPParse.getNumber(element["id"]);
        objeto.IdProducto = SPParse.getNumber(element["product_id"]);
        objeto.Codigo = SPParse.getString(element["code"]);
        objeto.Nombre = SPParse.getString(element["name"]);
        objeto.NombreCategoria = SPParse.getString(element["category"]);
        objeto.NombreMarca = SPParse.getString(element["brand"]);
        objeto.NombreUnidad = SPParse.getString(element["unit"]);
        objeto.StockActual = SPParse.getNumber(element["current_stock"]);
        objeto.StockMinimo = SPParse.getNumber(element["minimum_stock"]);
        objeto.EstadoStock = SPParse.getString(element["stock_status"]);
        objeto.ColorStock = SPParse.getString(element["stock_color"]);
        return objeto;
    }

    public static parseJsonList(elements: any): EProductStock[] {

        const listado: EProductStock[] = [];
        if (elements != null) {
            Object.keys(elements).forEach(key => {
                const element = elements[key];
                const objeto: EProductStock = EProductStock.parseJson(element);
                listado.push(objeto);
            })
        }
        return listado;
    }
}