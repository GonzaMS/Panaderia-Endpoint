using System.ComponentModel.DataAnnotations;

namespace Panaderia.Models
{
    public class Marcas_Ingredientes
    {
        [Key]
        public int id_marca_ingrediente { get; set; }
        [Required]
        public string? str_nombre_marca { get; set; }

        public virtual ICollection<Ingredientes>? Ingredientes { get; set; }
    }
}