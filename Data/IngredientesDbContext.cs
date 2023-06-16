using Panaderia.Models;
using Microsoft.EntityFrameworkCore;


namespace Panaderia.Data
{
    public class IngredientesDbContext : DbContext
    {
        public DbSet<Ingredientes> Ingredientes { get; set; }
        public DbSet<Marcas_Ingredientes> Marcas_Ingredientes { get; set; }

        public IngredientesDbContext(DbContextOptions<IngredientesDbContext> options) : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Ingredientes
            modelBuilder.Entity<Ingredientes>()
                        .HasKey(i => i.id_ingrediente);
            //Obteniendo el nombre del ingrediente
            modelBuilder.Entity<Ingredientes>()
                        .Property(i => i.str_nombre_ingrediente)
                        .HasColumnName("str_nombre_ingrediente");

            // Marca de ingredientes
            modelBuilder.Entity<Marcas_Ingredientes>()
                        .HasKey(m => m.id_marca_ingrediente);

            //Obteniendo el nombre de la marca
            modelBuilder.Entity<Marcas_Ingredientes>()
                        .Property(m => m.str_nombre_marca)
                        .HasColumnName("str_nombre_marca");

            //Relaciones entre tablas

            //Un ingrediente tiene una marca (relacion)
            modelBuilder.Entity<Ingredientes>()
                        .HasOne(i => i.Marcas_Ingredientes)
                        .WithMany(m => m.Ingredientes)
                        .HasForeignKey(i => i.fk_marca_ingrediente);

            //Una marca tiene varios ingredientes (relacion)
            modelBuilder.Entity<Marcas_Ingredientes>()
                        .HasMany(m => m.Ingredientes)
                        .WithOne(i => i.Marcas_Ingredientes)
                        .HasForeignKey(i => i.fk_marca_ingrediente);

            //Un ingrediente tiene varios detalles de recetas (relacion)
            modelBuilder.Entity<Ingredientes>()
                        .HasMany(i => i.Detalles_Recetas)
                        .WithOne(d => d.Ingredientes)
                        .HasForeignKey(d => d.fk_ingrediente);

            //Un ingrediente tiene varios detalles de compras (relacion)
            modelBuilder.Entity<Ingredientes>()
                        .HasMany(i => i.Detalles_de_compras)
                        .WithOne(d => d.Ingredientes)
                        .HasForeignKey(d => d.fk_ingrediente);

            //Un ingrediente tiene un ingredientes_stock (relacion)
            modelBuilder.Entity<Ingredientes>()
                        .HasOne(i => i.Ingredientes_stock)
                        .WithOne(s => s.Ingredientes)
                        .HasForeignKey<Ingredientes_stock>(s => s.fk_ingredientes);
        }
    }
}