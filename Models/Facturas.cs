using System.ComponentModel.DataAnnotations;

namespace Panaderia.Models
{
    //apii
    public class Facturas
    {
        [Key]
        public int id_factura { get; set; }
        [Required]
        public int int_timbrado { get; set; }
        [Required]
        public string? str_ruc_cliente { get; set; }
        [Required]
        public string? str_nombre_cliente { get; set; }
        public System.DateTime date_fecha_emision { get; set; }
        [Required]
        public float fl_total_pagar { get; set; }
        [Required]
        public float fl_iva_5 { get; set; }
        [Required]
        public float fl_iva_10 { get; set; }
        [Required]
        public int fk_cliente { get; set; }

        public virtual ICollection<Detalles_Facturas>? Detalles_Facturas { get; set; }
        public virtual Clientes? Clientes { get; set; }
        public virtual ICollection<Cobros>? Cobros { get; set; }


    }
}