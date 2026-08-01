import { SPParse } from "src/app/utils/SPParse";

export class ECotizacion {
    Id: any;
    IdCliente: number;
    NombreCliente: string;
    TelefonoCliente: string;
    NombreSucursal: string;
    RegistradoPor: string;
    Cotizacion: string;
    CotizacionSerie: string;
    CotizacionNumero: number;
    FechaAsunto: string;
    FechaExpiracion: string;
    SubTotal: number;
    Impuesto: number;
    Descuento: number;
    Total: number;
    CantidadItems: number;
    Estado: string;
    EstadoTexo: string;
    IdVenta: number;
    ConvertidoVenta: any;

    constructor() {
        this.Id = 0;
        this.IdCliente = 0;
        this.NombreCliente = "";
        this.TelefonoCliente = "";
        this.NombreSucursal = "";
        this.RegistradoPor = "";
        this.Cotizacion = "";
        this.CotizacionSerie = "";
        this.CotizacionNumero = 0;
        this.FechaAsunto = "";
        this.FechaExpiracion = "";
        this.SubTotal = 0;
        this.Impuesto = 0;
        this.Total = 0;
        this.CantidadItems = 0;
        this.Estado = "";
        this.EstadoTexo = "";
        this.IdVenta = 0;
        this.ConvertidoVenta = false;
    }

    public static parseJson(element: any): ECotizacion {
        const objeto = new ECotizacion();
        objeto.Id = SPParse.getNumber(element["id"]);
        objeto.IdCliente = SPParse.getNumber(element["customer_id"]);
        objeto.NombreCliente = SPParse.getString(element["customer_name"]);
        objeto.TelefonoCliente = SPParse.getString(element["customer_phone"]);
        objeto.NombreSucursal = SPParse.getString(element["branch_name"]);
        objeto.RegistradoPor = SPParse.getString(element["created_by"]);
        objeto.Cotizacion = SPParse.getString(element["quotation"]);
        objeto.CotizacionSerie = SPParse.getString(element["quotation_series"]);
        objeto.CotizacionNumero = SPParse.getNumber(element["quotation_number"]);
        objeto.FechaAsunto = SPParse.getString(element["issue_date"]);
        objeto.FechaExpiracion = SPParse.getString(element["expiration_date"]);
        objeto.SubTotal = SPParse.getFloat(element["subtotal"]);
        objeto.Impuesto = SPParse.getFloat(element["tax"]);
        objeto.Descuento = SPParse.getFloat(element["discount"]);
        objeto.Total = SPParse.getFloat(element["total"]);
        objeto.CantidadItems = SPParse.getNumber(element["items_count"]);
        objeto.Estado = SPParse.getString(element["status"]);
        objeto.EstadoTexo = SPParse.getString(element["status_label"]);
        objeto.IdVenta = SPParse.getNumber(element["sale_id"]);
        objeto.ConvertidoVenta = SPParse.getBool(element["converted"]);
        return objeto;
    }

    public static parseJsonList(elements: any): ECotizacion[] {
        const listado: ECotizacion[] = [];
        if (elements != null) {
            Object.keys(elements).forEach(key => {
                const element = elements[key];
                const objeto: ECotizacion = ECotizacion.parseJson(element);
                listado.push(objeto);
            })
        }
        return listado;
    }
}