using System.ComponentModel.DataAnnotations;

namespace Panaderia.Models
{
    public class Detalles_Productos
    {
        [Key]
        public int id_detalle_producto { get; set; }
        [Required]
        public int fk_producto_elaborado { get; set; }
        [Required]
        public System.DateTime date_elaboracion { get; set; }
        [Required]
        public System.DateTime date_vencimiento { get; set; }
        [Required]
        public float fl_iva { get; set; }

        public virtual Productos_elaborados? Productos_Elaborados { get; set; }
    }
}