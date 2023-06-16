using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Panaderia.Models
{
    public class Ingredientes_stock
    {
        [Key]
        public int id_ingrediente_stock { get; set; }
        [ForeignKey("Ingredientes")]
        public int fk_ingredientes { get; set; }
        [Required]
        public float fl_cantidad { get; set; }
        [Required]
        public int fk_stock { get; set; }

        public virtual Stocks? Stocks { get; set; }
        public virtual Ingredientes? Ingredientes { get; set; }

    }
}