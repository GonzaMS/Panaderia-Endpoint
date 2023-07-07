using System.ComponentModel.DataAnnotations;

namespace Panaderia.Models
{
    public class Detalles_cajas
    {
        [Key]
        public int id_detalle_caja { get; set; }
        public int fk_caja { get; set; }
        public float? fl_monto_caja { get; set; }
        public System.DateTime date_fecha_del_dia { get; set; }
        public int fk_cajero { get; set; }
        public System.DateTime date_hora_entrada { get; set; }
        public System.DateTime date_hora_salida { get; set; }
        public Boolean bool_estado_caja { get; set; }

        public virtual Cajas? Cajas { get; set; }
        public virtual Cajeros? Cajeros { get; set; }
        public virtual Arqueos? Arqueos { get; set; }
        public virtual ICollection<Movimientos>? Movimientos { get; set; }
    }
}
