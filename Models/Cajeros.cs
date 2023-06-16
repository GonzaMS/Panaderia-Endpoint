using System.ComponentModel.DataAnnotations;
//api
namespace Panaderia.Models
{
    public class Cajeros
    {
        [Key]
        public int id_cajero { get; set; }
        [Required]
        public string? str_nombre_cajero { get; set; }

        public virtual ICollection<Detalles_cajas>? Detalles_cajas { get; set; }
        public virtual ICollection<Arqueos>? Arqueos { get; set; }
    }
}
