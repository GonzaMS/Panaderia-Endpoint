using System.ComponentModel.DataAnnotations;

namespace Panaderia.Models
{
    public class Ordenes_produccion
    {
        [Key]
        public int id_orden { get; set; }
        [Required]
        public float fl_cantidad { get; set; }
        [Required]
        public int fk_producto_elaborado { get; set; }
        [Required]
        public Boolean bool_estado_orden { get; set; }

        public virtual Productos_elaborados? Productos_elaborados { get; set; }
    }
}

