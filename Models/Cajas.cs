using System.ComponentModel.DataAnnotations;

namespace Panaderia.Models
{
    public class Cajas
    {
        [Key]
        public int id_cajas { get; set; }
        [Required]
        public string? int_numero_caja { get; set; }

        public virtual ICollection<Detalles_cajas>? Detalles_cajas { get; set; }
    }
}
