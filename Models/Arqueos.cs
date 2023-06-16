using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Panaderia.Models
{
    //apii
    public class Arqueos
    {
        [Key]
        public int id_arqueo { get; set; }
        [Required]
        [ForeignKey("Detalles_cajas")]
        public int fk_detalle_cajas { get; set; }
        [Required]
        public int fk_cajero { get; set; }
        [Required]
        public string? str_descripcion { get; set; }

        public virtual ICollection<Detalles_arqueos>? Detalles_arqueos { get; set; }
        public virtual Cajeros? Cajero { get; set; }
        public virtual Detalles_cajas? Detalles_cajas { get; set; }
    }
}
