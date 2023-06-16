using Panaderia.Models;
using Microsoft.EntityFrameworkCore;


namespace Panaderia.Data
{
    public class OrdenesDbContext : DbContext
    {
        public DbSet<Ordenes_produccion> Ordenes_Produccion { get; set; }

        public OrdenesDbContext(DbContextOptions<OrdenesDbContext> options) : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //Ordenes de produccion
            modelBuilder.Entity<Ordenes_produccion>()
                        .HasKey(o => o.id_orden);
            modelBuilder.Entity<Ordenes_produccion>()
                        .Property(o => o.fl_cantidad)
                        .HasColumnName("fl_cantidad");
            modelBuilder.Entity<Ordenes_produccion>()
                        .Property(o => o.fk_producto_elaborado)
                        .HasColumnName("fk_producto_elaborado");
            modelBuilder.Entity<Ordenes_produccion>()
                        .Property(o => o.bool_estado_orden)
                        .HasColumnName("bool_estado_orden");

            //Relaciones entre tablas
            //Una orden de produccion tiene un producto elaborado (relacion)
            modelBuilder.Entity<Ordenes_produccion>()
                        .HasOne(p => p.Productos_elaborados)
                        .WithMany(o => o.Ordenes_produccion)
                        .HasForeignKey(p => p.fk_producto_elaborado);
        }
    }
}