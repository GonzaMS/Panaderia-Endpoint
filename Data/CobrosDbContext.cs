using Panaderia.Models;
using Microsoft.EntityFrameworkCore;

namespace Panaderia.Data
{
    public class CobrosDbContext : DbContext
    {

        public DbSet<Formas_pagos> Formas_Pagos { get; set; }
        public DbSet<Cobros> Cobros { get; set; }
        public DbSet<Movimientos> Movimientos { get; set; }

        public CobrosDbContext(DbContextOptions<CobrosDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //Formas de pago
            modelBuilder.Entity<Formas_pagos>()
                        .HasKey(p => p.id_forma_pago);
            modelBuilder.Entity<Formas_pagos>()
                        .Property(p => p.str_formas)
                        .HasColumnName("str_formas");

            //Cobros
            modelBuilder.Entity<Cobros>()
                        .HasKey(p => p.id_cobro);
            modelBuilder.Entity<Cobros>()
                        .Property(p => p.fk_forma_pago)
                        .HasColumnName("fk_forma_pago");
            modelBuilder.Entity<Cobros>()
                        .Property(p => p.fl_monto_pago)
                        .HasColumnName("fl_monto_pago");
            modelBuilder.Entity<Cobros>()
                        .Property(p => p.str_titular)
                        .HasColumnName("str_titular");
            modelBuilder.Entity<Cobros>()
                        .Property(p => p.str_numero_celular)
                        .HasColumnName("str_numero_celular");
            modelBuilder.Entity<Cobros>()
                        .Property(p => p.int_num_cuenta_corriente)
                        .HasColumnName("int_num_cuenta_corriente");
            modelBuilder.Entity<Cobros>()
                        .Property(p => p.fk_movimiento)
                        .HasColumnName("fk_movimiento");
            modelBuilder.Entity<Cobros>()
                        .Property(p => p.fk_factura)
                        .HasColumnName("fk_factura");

            //Movimientos
            modelBuilder.Entity<Movimientos>()
                        .HasKey(p => p.id_movimiento);
            modelBuilder.Entity<Movimientos>()
                        .Property(p => p.int_entrada_salida)
                        .HasColumnName("int_entrada_salida");
            modelBuilder.Entity<Movimientos>()
                        .Property(p => p.fk_detalle_caja)
                        .HasColumnName("fk_detalle_caja");

            //Relaciones entre tablas

            //Una forma de pago tiene muchos cobros
            modelBuilder.Entity<Formas_pagos>()
                        .HasMany<Cobros>(g => g.Cobros)
                        .WithOne(s => s.Formas_pagos)
                        .HasForeignKey(s => s.fk_forma_pago);

            //Un cobro tiene una forma de pago
            modelBuilder.Entity<Cobros>()
                        .HasOne<Formas_pagos>(s => s.Formas_pagos)
                        .WithMany(g => g.Cobros)
                        .HasForeignKey(s => s.fk_forma_pago);

            //Un movimiento tiene muchos cobros
            modelBuilder.Entity<Movimientos>()
                        .HasMany<Cobros>(g => g.Cobros)
                        .WithOne(s => s.Movimientos)
                        .HasForeignKey(s => s.fk_movimiento);

            //Un cobro tiene un movimiento
            modelBuilder.Entity<Cobros>()
                        .HasOne<Movimientos>(s => s.Movimientos)
                        .WithMany(g => g.Cobros)
                        .HasForeignKey(s => s.fk_movimiento);

            //Un cobro tiene una factura
            modelBuilder.Entity<Cobros>()
                        .HasOne<Facturas>(s => s.Facturas)
                        .WithMany(g => g.Cobros)
                        .HasForeignKey(s => s.fk_factura);

            //Un movimiento tiene un detalles cajas
            modelBuilder.Entity<Movimientos>()
                        .HasOne<Detalles_cajas>(s => s.Detalles_cajas)
                        .WithMany(g => g.Movimientos)
                        .HasForeignKey(s => s.fk_detalle_caja);
        }

    }
}