using Panaderia.Models;
using Microsoft.EntityFrameworkCore;

namespace Panaderia.Data;
public class StocksDbContext : DbContext
{
    public DbSet<Stocks> Stocks { get; set; }
    public DbSet<Productos_Elaborados_Stock> Productos_Elaborados_Stock { get; set; }
    public DbSet<Ingredientes_stock> Ingredientes_stock { get; set; }
    public StocksDbContext(DbContextOptions<StocksDbContext> options) : base(options)
    {
    }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        //Stocks
        modelBuilder.Entity<Stocks>()
                    .HasKey(p => p.id_stock);
        modelBuilder.Entity<Stocks>()
                    .Property(p => p.str_nombre_stock)
                    .HasColumnName("str_nombre_stock");
        modelBuilder.Entity<Stocks>()
                    .Property(p => p.str_direccion)
                    .HasColumnName("str_direccion");

        //Productos_Elaborados_Stock
        modelBuilder.Entity<Productos_Elaborados_Stock>()
                    .HasKey(p => p.id_producto_stock);
        modelBuilder.Entity<Productos_Elaborados_Stock>()
                    .Property(p => p.fk_producto_elaborado)
                    .HasColumnName("fk_producto_elaborado");
        modelBuilder.Entity<Productos_Elaborados_Stock>()
                    .Property(p => p.fk_stock)
                    .HasColumnName("fk_stock");
        modelBuilder.Entity<Productos_Elaborados_Stock>()
                    .Property(p => p.fl_cantidad)
                    .HasColumnName("fl_cantidad");

        //un detalle de compora tiene un stock  
        modelBuilder.Entity<Stocks>()
                    .HasMany(i => i.Detalles_de_compras)
                    .WithOne(d => d.Stocks)
                    .HasForeignKey(d => d.fk_ingrediente);

        //El stock productos_elaborados_sotck tiene un stock
        modelBuilder.Entity<Stocks>()
                    .HasMany(s => s.Productos_Elaborados_Stock)
                    .WithOne(p => p.Stocks)
                    .HasForeignKey(p => p.fk_stock);
        //El stock de productos_elaborados_stock tiene un producto elaborado
        modelBuilder.Entity<Productos_elaborados>()
                    .HasOne(p => p.Productos_Elaborados_Stock)
                    .WithOne(s => s.Productos_elaborados)
                    .HasForeignKey<Productos_Elaborados_Stock>(s => s.fk_producto_elaborado);

        //Un stock tiene varios ingredientes_stocks
        modelBuilder.Entity<Stocks>()
                    .HasMany(s => s.Ingredientes_stock)
                    .WithOne(i => i.Stocks)
                    .HasForeignKey(i => i.fk_stock);

        //Un stock ingredientes_stocks tiene un ingrediente
        modelBuilder.Entity<Ingredientes>()
                    .HasOne(i => i.Ingredientes_stock)
                    .WithOne(s => s.Ingredientes)
                    .HasForeignKey<Ingredientes_stock>(s => s.fk_ingredientes);

        //Un stock tiene varios movimientos de stock
        modelBuilder.Entity<Stocks>()
                    .HasMany(s => s.Movimiento_stock)
                    .WithOne(m => m.Stocks)
                    .HasForeignKey(m => m.fk_stock);
    }
}