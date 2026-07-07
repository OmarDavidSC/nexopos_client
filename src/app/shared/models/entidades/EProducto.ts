import { SPParse } from "src/app/utils/SPParse";

export class EProducto {
    Id: number;
    Codigo: string;
    Nombre: string;
    IdCategoria: number;
    NombreCategoria: string;
    IdMarca: number;
    NombreMarca: string;
    IdUnidad: number;
    NombreUnidad: string;
    PrecioCompra: number;
    PrecioVenta: number;
    StockActual: number;
    StockMinimo: number;
    Estado: string;
    EstadoLabel: string;
    FechaCreacion: string;
    FechaModificacion: string;

    constructor() {
        this.Id = 0;
        this.Codigo = "";
        this.Nombre = "";
        this.IdCategoria = 0;
        this.NombreCategoria = "";
        this.IdMarca = 0;
        this.NombreMarca = "";
        this.IdUnidad = 0;
        this.NombreUnidad = "";
        this.PrecioCompra = 0;
        this.PrecioVenta = 0;
        this.StockActual = 0;
        this.StockMinimo = 0;
        this.Estado = "";
        this.EstadoLabel = "";
        this.FechaCreacion = "";
        this.FechaModificacion = "";
    }

    public static parseJson(element: any): EProducto {
        const objeto = new EProducto();

        objeto.Id = SPParse.getNumber(element["id"]);
        objeto.Codigo = SPParse.getString(element["code"]);
        objeto.Nombre = SPParse.getString(element["name"]);
        objeto.IdCategoria = SPParse.getNumber(element["category_id"]);
        objeto.NombreCategoria = SPParse.getString(element["category"]);
        objeto.IdMarca = SPParse.getNumber(element["brand_id"]);
        objeto.NombreMarca = SPParse.getString(element["brand"]);
        objeto.IdUnidad = SPParse.getNumber(element["unit_id"]);
        objeto.NombreUnidad = SPParse.getString(element["unit"]);
        objeto.PrecioCompra = SPParse.getFloat(element["purchase_price"]);
        objeto.PrecioVenta = SPParse.getFloat(element["sale_price"]);
        objeto.StockActual = SPParse.getNumber(element["current_stock"]);
        objeto.StockMinimo = SPParse.getNumber(element["minimum_stock"]);
        objeto.Estado = SPParse.getString(element["status"]);
        objeto.EstadoLabel = SPParse.getString(element["status_label"]);
        objeto.FechaCreacion = SPParse.getString(element["datecreated_label"]);
        objeto.FechaModificacion = SPParse.getString(element["dateupdated_label"]);
        return objeto;
    }

    public static parseJsonList(elements: any): EProducto[] {

        const listado: EProducto[] = [];
        if (elements != null) {
            Object.keys(elements).forEach(key => {
                const element = elements[key];
                const objeto: EProducto = EProducto.parseJson(element);
                listado.push(objeto);
            })
        }
        return listado;
    }
}