using System.ComponentModel.DataAnnotations;

namespace Panaderia.Models
{
    public class Billetes
    {
        [Key]
        public int id_billete { get; set; }
        [Required]
        public String? str_numero_divisa { get; set; }
        [Required]
        public String? str_tamanho_efectivo { get; set; }

        public virtual ICollection<Detalles_efectivos>? Detalles_efectivos { get; set; }
    }
}