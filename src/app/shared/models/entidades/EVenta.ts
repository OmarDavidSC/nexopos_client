import { SPParse } from "src/app/utils/SPParse";

export class EVenta {
    Id: any;
    IdCliente: number;
    NombreCliente: string;
    NombreUsuarioRegistrador: string;
    FechaVenta: string;
    TipoDocumento: string;
    SerieDocumento: string;
    NumeroDocumento: number;
    Documento: string;
    MetodoPago: string;
    SubTotal: number;
    Impuesto: number;
    Descuento: number;
    Total: number;
    ProductoTotales: number;
    Estado: string;
    EstadoLabel: string;
    EstadoSunat: string;

    MetodoCondicion: string;
    ImportePagado: number;
    SaldoPendiente: number;
    FechaVencimiento: string;
    FechaVencimientoSinFormato: string;
    EstadoPago: string;

    constructor() {
        this.Id = 0;
        this.IdCliente = 0;
        this.NombreCliente = "";
        this.NombreUsuarioRegistrador = "";
        this.FechaVenta = "";
        this.TipoDocumento = "";
        this.SerieDocumento = "";
        this.NumeroDocumento = 0;
        this.Documento = "";
        this.MetodoPago = "";
        this.SubTotal = 0;
        this.Impuesto = 0;
        this.Descuento = 0;
        this.ProductoTotales = 0;
        this.Total = 0;
        this.Estado = "";
        this.EstadoLabel = "";
        this.EstadoSunat = "";
        this.MetodoCondicion = "";
        this.ImportePagado = 0;
        this.SaldoPendiente = 0;
        this.FechaVencimiento = "";
        this.FechaVencimientoSinFormato = "";
        this.EstadoPago = "";
    }

    public static parseJson(element: any): EVenta {
        const objeto = new EVenta();
        objeto.Id = SPParse.getNumber(element["id"]);
        objeto.IdCliente = SPParse.getNumber(element["customer_id"]);
        objeto.NombreCliente = SPParse.getString(element["customer_name"]);
        objeto.NombreUsuarioRegistrador = SPParse.getString(element["user"]);
        objeto.FechaVenta = SPParse.getString(element["sale_date"]);
        objeto.TipoDocumento = SPParse.getString(element["voucher_type"]);
        objeto.SerieDocumento = SPParse.getString(element["voucher_series"]);
        objeto.NumeroDocumento = SPParse.getNumber(element["voucher_number"]);
        objeto.Documento = SPParse.getString(element["voucher"]);
        objeto.MetodoPago = SPParse.getString(element["payment_method"]);
        objeto.SubTotal = SPParse.getNumber(element["subtotal"]);
        objeto.Impuesto = SPParse.getNumber(element["tax"]);
        objeto.Descuento = SPParse.getNumber(element["discount"]);
        objeto.Total = SPParse.getNumber(element["total"]);
        objeto.ProductoTotales = SPParse.getNumber(element["items_count"]);
        objeto.Estado = SPParse.getString(element["status"]);
        objeto.EstadoLabel = SPParse.getString(element["status_label"]);
        objeto.EstadoSunat = SPParse.getString(element["sunat_status"]);
        objeto.MetodoCondicion = SPParse.getString(element["payment_condition"]);
        objeto.ImportePagado = SPParse.getNumber(element["amount_paid"]);
        objeto.SaldoPendiente = SPParse.getNumber(element["balance_due"]);
        objeto.FechaVencimiento = SPParse.getString(element["due_date"]);
        objeto.FechaVencimientoSinFormato = SPParse.getString(element["due_date_raw"]);
        objeto.EstadoPago = SPParse.getString(element["payment_status"]);
        return objeto;
    }

    public static parseJsonList(elements: any): EVenta[] {
        const listado: EVenta[] = [];
        if (elements != null) {
            Object.keys(elements).forEach(key => {
                const element = elements[key];
                const objeto: EVenta = EVenta.parseJson(element);
                listado.push(objeto);
            })
        }
        return listado;
    }
}