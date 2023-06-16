using System.ComponentModel.DataAnnotations;

namespace Panaderia.Models
{
    public class Detalles_Recetas
    {
        [Key]
        public int id_detalle_receta { get; set; }
        [Required]
        public int fk_receta { get; set; }
        [Required]
        public int fk_ingrediente { get; set; }
        [Required]
        public float fl_cantidad { get; set; }

        public virtual Recetas? Recetas { get; set; }
        public virtual Ingredientes? Ingredientes { get; set; }
    }
}