using System.ComponentModel.DataAnnotations;

namespace Panaderia.Models
{
    public class Recetas
    {
        [Key]
        public int id_receta { get; set; }
        [Required]
        public string? str_receta { get; set; }
        [Required]
        public string? str_preparacion { get; set; }

        public virtual ICollection<Detalles_Recetas>? Detalles_Recetas { get; set; }
        public virtual Productos_elaborados? Productos_elaborados { get; set; }
    }
}