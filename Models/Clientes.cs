using System.ComponentModel.DataAnnotations;

namespace Panaderia.Models
{
    public class Clientes
    {
        [Key]
        public int id_cliente { get; set; }
        [Required]
        public string? str_nombre_cliente { get; set; }
        [Required]
        public string? str_ruc_cliente { get; set; }
        [Required]
        public string? str_ci_cliente { get; set; }
        [Required]
        public string? str_telefono_cliente { get; set; }
        [Required]
        public string? str_direccion_cliente { get; set; }

        public virtual ICollection<Facturas>? Facturas { get; set; }
    }
}