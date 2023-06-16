using Panaderia.Models;
using Microsoft.EntityFrameworkCore;

namespace Panaderia.Data
{
    public class FacturasDbContext : DbContext
    {
        public DbSet<Facturas> Facturas { get; set; }
        public DbSet<Detalles_Facturas> Detalles_Facturas { get; set; }

        public DbSet<Clientes> Clientes { get; set; }

        public FacturasDbContext(DbContextOptions<FacturasDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Facturas
            modelBuilder.Entity<Facturas>()
                        .HasKey(f => f.id_factura);
            modelBuilder.Entity<Facturas>()
                        .Property(f => f.int_timbrado)
                        .HasColumnName("int_timbrado");
            modelBuilder.Entity<Facturas>()
                        .Property(f => f.str_ruc_cliente)
                        .HasColumnName("str_ruc_cliente");
            modelBuilder.Entity<Facturas>()
                        .Property(f => f.str_nombre_cliente)
                        .HasColumnName("str_nombre_cliente");
            modelBuilder.Entity<Facturas>()
                        .Property(f => f.date_fecha_emision)
                        .HasColumnName("date_fecha_emision");
            modelBuilder.Entity<Facturas>()
                        .Property(f => f.fl_total_pagar)
                        .HasColumnName("fl_total_pagar");
            modelBuilder.Entity<Facturas>()
                        .Property(f => f.fl_iva_5)
                        .HasColumnName("fl_iva_5");
            modelBuilder.Entity<Facturas>()
                        .Property(f => f.fl_iva_10)
                        .HasColumnName("fl_iva_10");
            modelBuilder.Entity<Facturas>()
                        .Property(f => f.fk_cliente)
                        .HasColumnName("fk_cliente");

            //Detalles_Facturas
            modelBuilder.Entity<Detalles_Facturas>()
                        .HasKey(d => d.id_detalle_factura);
            modelBuilder.Entity<Detalles_Facturas>()
                        .Property(d => d.int_cantidad)
                        .HasColumnName("int_cantidad");
            modelBuilder.Entity<Detalles_Facturas>()
                        .Property(d => d.fl_iva)
                        .HasColumnName("fl_iva");
            modelBuilder.Entity<Detalles_Facturas>()
                        .Property(d => d.fk_factura)
                        .HasColumnName("fk_factura");
            modelBuilder.Entity<Detalles_Facturas>()
                        .Property(d => d.fk_producto)
                        .HasColumnName("fk_producto");


            //Clientes
            modelBuilder.Entity<Clientes>()
                    .HasKey(c => c.id_cliente);
            modelBuilder.Entity<Clientes>()
                        .Property(c => c.str_nombre_cliente)
                        .HasColumnName("str_nombre_cliente");
            modelBuilder.Entity<Clientes>()
                        .Property(c => c.str_ruc_cliente)
                        .HasColumnName("str_ruc_cliente");
            modelBuilder.Entity<Clientes>()
                        .Property(c => c.str_ci_cliente)
                        .HasColumnName("str_ci_cliente");
            modelBuilder.Entity<Clientes>()
                        .Property(c => c.str_telefono_cliente)
                        .HasColumnName("str_telefono_cliente");
            modelBuilder.Entity<Clientes>()
                        .Property(c => c.str_direccion_cliente)
                        .HasColumnName("str_direccion_cliente");


            //Relaciones entre tablas
            //Una factura tiene varios detalles
            modelBuilder.Entity<Facturas>()
                        .HasMany(f => f.Detalles_Facturas)
                        .WithOne(d => d.Facturas)
                        .HasForeignKey(d => d.fk_factura);

            //Un detalle tiene una factura
            modelBuilder.Entity<Detalles_Facturas>()
                        .HasOne(d => d.Facturas)
                        .WithMany(f => f.Detalles_Facturas)
                        .HasForeignKey(d => d.fk_factura);

            //Un detalle_factura tiene un producto elaborado
            modelBuilder.Entity<Detalles_Facturas>()
                        .HasOne(d => d.Productos_elaborados)
                        .WithMany(p => p.Detalles_Facturas)
                        .HasForeignKey(d => d.fk_producto);

            //Una factura tiene un cliente
            modelBuilder.Entity<Facturas>()
                        .HasOne(f => f.Clientes)
                        .WithMany(c => c.Facturas)
                        .HasForeignKey(f => f.fk_cliente);

            //Un cliente tiene varias facturas
            modelBuilder.Entity<Clientes>()
                        .HasMany(c => c.Facturas)
                        .WithOne(f => f.Clientes)
                        .HasForeignKey(f => f.fk_cliente);



            //Una factura tiene varios cobros
            modelBuilder.Entity<Facturas>()
                        .HasMany(f => f.Cobros)
                        .WithOne(c => c.Facturas)
                        .HasForeignKey(c => c.fk_factura);
        }

    }
}