import { SPParse } from "src/app/utils/SPParse";

export class ECompra {
    Id: any;
    IdProveedor: number;
    NombreProveedor: string;
    NombreUsuarioRegistrador: string;
    FechaCompra: string;
    TipoDocumento: string;
    SerieDocumento: string;
    NumeroDocumento: number;
    Documento: string;
    SubTotal: number;
    Impuesto: number;
    Descuento: number;
    ProductoTotales: number;
    Total: number;
    Estado: string;
    EstadoLabel: string;
    Observacion: string;

    constructor() {
        this.Id = 0;
        this.IdProveedor = 0;
        this.NombreProveedor = "";
        this.NombreUsuarioRegistrador = "";
        this.FechaCompra = "";
        this.TipoDocumento = "";
        this.SerieDocumento = "";
        this.NumeroDocumento = 0;
        this.Documento = "";
        this.SubTotal = 0;
        this.Impuesto = 0;
        this.Descuento = 0;
        this.ProductoTotales = 0;
        this.Total = 0;
        this.Estado = "";
        this.EstadoLabel = "";
        this.Observacion = "";
    }

    public static parseJson(element: any): ECompra {
        const objeto = new ECompra();
        objeto.Id = SPParse.getNumber(element["id"]);
        objeto.IdProveedor = SPParse.getNumber(element["supplier_id"]);
        objeto.NombreProveedor = SPParse.getString(element["supplier"]);
        objeto.NombreUsuarioRegistrador = SPParse.getString(element["user"]);
        objeto.FechaCompra = SPParse.getString(element["purchase_date"]);
        objeto.TipoDocumento = SPParse.getString(element["voucher_type"]);
        objeto.SerieDocumento = SPParse.getString(element["voucher_series"]);
        objeto.NumeroDocumento = SPParse.getNumber(element["voucher_number"]);
        objeto.Documento = SPParse.getString(element["voucher"]);
        objeto.SubTotal = SPParse.getNumber(element["subtotal"]);
        objeto.Impuesto = SPParse.getNumber(element["tax"]);
        objeto.Descuento = SPParse.getNumber(element["discount"]);
        objeto.ProductoTotales = SPParse.getNumber(element["items_count"]);
        objeto.Total = SPParse.getNumber(element["total"]);
        objeto.Estado = SPParse.getString(element["status"]);
        objeto.EstadoLabel = SPParse.getString(element["status_label"]);
        objeto.Observacion = SPParse.getString(element["observation"]);
        return objeto;
    }

    public static parseJsonList(elements: any): ECompra[] {
        const listado: ECompra[] = [];
        if (elements != null) {
            Object.keys(elements).forEach(key => {
                const element = elements[key];
                const objeto: ECompra = ECompra.parseJson(element);
                listado.push(objeto);
            })
        }
        return listado;
    }
}