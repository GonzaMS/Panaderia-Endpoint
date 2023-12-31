using System.ComponentModel.DataAnnotations;

namespace Panaderia.Models
{
    public class Compras
    {
        [Key]
        public int id_compra { get; set; }
        public int fk_proveedor { get; set; }
        public float fl_precio_total { get; set; }
        public System.DateTime date_compra { get; set; }
        public string? str_numero_factura { get; set; }

        public virtual Proveedores? Proveedores { get; set; }
        public virtual ICollection<Detalles_de_compras>? Detalles_de_compras { get; set; }
    }
}