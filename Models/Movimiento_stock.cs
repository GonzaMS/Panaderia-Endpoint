using System.ComponentModel.DataAnnotations;

namespace Panaderia.Models
{
    public class Movimiento_stock
    {
        [Key]
        public int id_transferencia_stock { get; set; }
        [Required]
        public int? fk_producto_elaborado { get; set; }
        [Required]
        public int fk_stock { get; set; }
        [Required]
        public int fk_tipo_movimiento { get; set; }
        [Required]
        public float fl_cantidad { get; set; }
        [Required]
        public System.DateTime date_fecha_ingreso { get; set; }

        public virtual Productos_elaborados? Productos_elaborados { get; set; }
        public virtual Stocks? Stocks { get; set; }
        public virtual Tipos_movimientos? Tipos_movimientos { get; set; }
    }
}