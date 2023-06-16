using System.ComponentModel.DataAnnotations;

namespace Panaderia.Models
{
    public class Stocks
    {
        [Key]
        public int id_stock { get; set; }
        [Required]
        public string? str_nombre_stock { get; set; }
        [Required]
        public string? str_direccion { get; set; }
        public virtual ICollection<Detalles_de_compras>? Detalles_de_compras { get; set; }
        public virtual ICollection<Productos_Elaborados_Stock>? Productos_Elaborados_Stock { get; set; }
        public virtual ICollection<Ingredientes_stock>? Ingredientes_stock { get; set; }
        public virtual ICollection<Movimiento_stock>? Movimiento_stock { get; set; }
    }
}