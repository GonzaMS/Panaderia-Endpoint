using System.ComponentModel.DataAnnotations;

namespace Panaderia.Models
{
    public class Movimientos
    {
        [Key]
        public int id_movimiento { get; set; }
        [Required]
        public int int_entrada_salida { get; set; }
        [Required]
        public int fk_detalle_caja { get; set; }

        public virtual ICollection<Cobros>? Cobros { get; set; }
        public virtual Detalles_cajas? Detalles_cajas { get; set; }
    }
}

