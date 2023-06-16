using System.ComponentModel.DataAnnotations;

namespace Panaderia.Models
{
    public class Formas_pagos
    {
        [Key]
        public int id_forma_pago { get; set; }
        [Required]
        public string? str_formas { get; set; }

        public virtual ICollection<Cobros>? Cobros { get; set; }
    }
}