using Panaderia.Models;
using Microsoft.EntityFrameworkCore;

namespace Panaderia.Data
{
    public class ComprasDbContext : DbContext
    {
        public DbSet<Compras> Compras { get; set; }

        public DbSet<Detalles_de_compras> Detalles_de_compras { get; set; }

        public ComprasDbContext(DbContextOptions<ComprasDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //Compras
            modelBuilder.Entity<Compras>()
                        .HasKey(p => p.id_compra);
            modelBuilder.Entity<Compras>()
                        .Property(p => p.fk_proveedor)
                        .HasColumnName("fk_proveedor");
            modelBuilder.Entity<Compras>()
                        .Property(p => p.fl_precio_total)
                        .HasColumnName("fl_precio_total");
            modelBuilder.Entity<Compras>()
                        .Property(p => p.date_compra)
                        .HasColumnName("date_compra");
            modelBuilder.Entity<Compras>()
                        .Property(p => p.str_numero_factura)
                        .HasColumnName("str_numero_factura");


            //Detalle de compras
            modelBuilder.Entity<Detalles_de_compras>()
                        .HasKey(p => p.id_detalle_compra);
            modelBuilder.Entity<Detalles_de_compras>()
                        .Property(p => p.fk_compra)
                        .HasColumnName("fk_compra");
            modelBuilder.Entity<Detalles_de_compras>()
                        .Property(p => p.fk_ingrediente)
                        .HasColumnName("fk_ingrediente");
            modelBuilder.Entity<Detalles_de_compras>()
                        .Property(p => p.fk_stock)
                        .HasColumnName("fk_stock");
            modelBuilder.Entity<Detalles_de_compras>()
                        .Property(p => p.fl_precio_unidad)
                        .HasColumnName("fl_precio_unidad");
            modelBuilder.Entity<Detalles_de_compras>()
                        .Property(p => p.int_cantidad)
                        .HasColumnName("int_cantidad");
            modelBuilder.Entity<Detalles_de_compras>()
                        .Property(p => p.fl_iva)
                        .HasColumnName("fl_iva");


            //Relaciones

            //Una compra tiene un proveedor
            modelBuilder.Entity<Compras>()
                        .HasOne(p => p.Proveedores)
                        .WithMany(c => c.Compras)
                        .HasForeignKey(c => c.fk_proveedor);

            //Una compra tiene varios detalles de compra
            modelBuilder.Entity<Compras>()
                        .HasMany(c => c.Detalles_de_compras)
                        .WithOne(d => d.Compras)
                        .HasForeignKey(d => d.fk_compra);

            //Un detalle de compra tiene una compra 
            modelBuilder.Entity<Detalles_de_compras>()
                        .HasOne(d => d.Compras)
                        .WithMany(c => c.Detalles_de_compras)
                        .HasForeignKey(d => d.fk_compra);

            //Un detalle de compra tiene un ingrediente
            modelBuilder.Entity<Detalles_de_compras>()
                        .HasOne(d => d.Ingredientes)
                        .WithMany(i => i.Detalles_de_compras)
                        .HasForeignKey(d => d.fk_ingrediente);

            //Un detalle de compra tiene un stock
            modelBuilder.Entity<Detalles_de_compras>()
                        .HasOne(d => d.Stocks)
                        .WithMany(s => s.Detalles_de_compras)
                        .HasForeignKey(d => d.fk_stock);

            //Un ingrediente tiene un solo stock ingredientes_stocks
            modelBuilder.Entity<Ingredientes>()
                        .HasOne(i => i.Ingredientes_stock)
                        .WithOne(s => s.Ingredientes)
                        .HasForeignKey<Ingredientes_stock>(s => s.fk_ingredientes);
        }
    }
}