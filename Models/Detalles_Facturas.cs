using System.ComponentModel.DataAnnotations;

namespace Panaderia.Models
{
    public class Detalles_Facturas
    {
        [Key]
        public int id_detalle_factura { get; set; }
        [Required]
        public int int_cantidad { get; set; }
        [Required]
        public float fl_iva { get; set; }
        [Required]
        public int fk_factura { get; set; }
        [Required]
        public int fk_producto { get; set; }

        public virtual Facturas? Facturas { get; set; }
        public virtual Productos_elaborados? Productos_elaborados { get; set; }

    }
}