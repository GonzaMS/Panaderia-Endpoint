using System.ComponentModel.DataAnnotations;

namespace Panaderia.Models
{
    public class Ingredientes
    {
        [Key]
        public int id_ingrediente { get; set; }
        [Required]
        public int fk_marca_ingrediente { get; set; }
        [Required]
        public string? str_nombre_ingrediente { get; set; }

        public virtual Marcas_Ingredientes? Marcas_Ingredientes { get; set; }
        public virtual ICollection<Detalles_Recetas>? Detalles_Recetas { get; set; }
        public virtual ICollection<Detalles_de_compras>? Detalles_de_compras { get; set; }
        public virtual Ingredientes_stock? Ingredientes_stock { get; set; }
    }
}
