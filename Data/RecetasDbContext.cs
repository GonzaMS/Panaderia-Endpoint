using Panaderia.Models;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;


namespace Panaderia.Data
{
    public class RecetasDbContext : DbContext
    {
        public DbSet<Recetas> Recetas { get; set; }
        public DbSet<Detalles_Recetas> Detalles_Recetas { get; set; }

        public RecetasDbContext(DbContextOptions<RecetasDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //Recetas
            modelBuilder.Entity<Recetas>()
                        .HasKey(p => p.id_receta);
            modelBuilder.Entity<Recetas>()
                        .Property(p => p.str_receta)
                        .HasColumnName("str_receta");
            modelBuilder.Entity<Recetas>()
                        .Property(p => p.str_preparacion)
                        .HasColumnName("str_preparacion");

            //Detalles de recetas
            modelBuilder.Entity<Detalles_Recetas>()
                        .HasKey(p => p.id_detalle_receta);
            modelBuilder.Entity<Detalles_Recetas>()
                        .Property(p => p.fk_receta)
                        .HasColumnName("fk_receta");
            modelBuilder.Entity<Detalles_Recetas>()
                        .Property(p => p.fk_ingrediente)
                        .HasColumnName("fk_ingrediente");


            //Relaciones entre tablas

            //Un detalle de receta tiene una receta (relacion)
            modelBuilder.Entity<Detalles_Recetas>()
                        .HasOne(d => d.Recetas)
                        .WithMany(r => r.Detalles_Recetas)
                        .HasForeignKey(d => d.fk_receta);

            //Una receta tiene varios detalles de recetas (relacion)
            modelBuilder.Entity<Recetas>()
                        .HasMany(r => r.Detalles_Recetas)
                        .WithOne(d => d.Recetas)
                        .HasForeignKey(d => d.fk_receta);

            //Un detalle de receta tiene un ingrediente (relacion)
            modelBuilder.Entity<Detalles_Recetas>()
                        .HasOne(d => d.Ingredientes)
                        .WithMany(i => i.Detalles_Recetas)
                        .HasForeignKey(d => d.fk_ingrediente);

            //Una receta tiene un producto elaborado (relacion)
            modelBuilder.Entity<Recetas>()
                        .HasOne(r => r.Productos_elaborados)
                        .WithOne(p => p.Recetas)
                        .HasForeignKey<Productos_elaborados>(p => p.fk_recetas);
        }
    }
}