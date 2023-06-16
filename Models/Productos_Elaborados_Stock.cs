using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Panaderia.Models
{
    public class Productos_Elaborados_Stock
    {
        [Key]
        public int id_producto_stock { get; set; }
        [Required]
        [ForeignKey("Productos_elaborados")]
        public int fk_producto_elaborado { get; set; }
        [Required]
        public int fk_stock { get; set; }
        [Required]
        public float fl_cantidad { get; set; }

        public virtual Stocks? Stocks { get; set; }
        public virtual Productos_elaborados? Productos_elaborados { get; set; }

    }
}