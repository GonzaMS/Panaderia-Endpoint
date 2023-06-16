using System.ComponentModel.DataAnnotations;

namespace Panaderia.Models
{
    public class Detalles_arqueos
    {
        [Key]
        public int id_detalle_arqueo { get; set; }
        [Required]
        public int fk_arqueo { get; set; }
        [Required]
        public float fl_total { get; set; }

        public virtual Arqueos? Arqueos { get; set; }
        public virtual ICollection<Detalles_efectivos>? Detalles_efectivos { get; set; }
    }
}
