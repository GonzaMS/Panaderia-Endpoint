using System.ComponentModel.DataAnnotations;

namespace Panaderia.Models
{
    public class Detalles_efectivos
    {
        [Key]
        public int id_detalles_efectivos { get; set; }
        [Required]
        public int fk_billete { get; set; }
        [Required]
        public int int_cantidad_billete { get; set; }
        [Required]
        public int fk_detalle_arqueo { get; set; }
        [Required]
        public int int_total_billete { get; set; }

        public virtual Billetes? Billetes { get; set; }
        public virtual Detalles_arqueos? Detalles_arqueos { get; set; }

    }
}