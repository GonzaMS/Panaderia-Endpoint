using Panaderia.Models;
using Microsoft.EntityFrameworkCore;
namespace Panaderia.Data
{
    public class ProductosyMovimientosDbContext : DbContext
    {

        public DbSet<Productos_elaborados> Productos_elaborados { get; set; }
        public DbSet<Detalles_Productos> Detalles_productos { get; set; }

        public DbSet<Movimiento_stock> Movimiento_stock { get; set; }
        public DbSet<Tipos_movimientos> Tipos_movimientos { get; set; }


        public ProductosyMovimientosDbContext(DbContextOptions<ProductosyMovimientosDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //Productos elaborados
            modelBuilder.Entity<Productos_elaborados>()
                        .HasKey(p => p.id_producto_elaborado);
            modelBuilder.Entity<Productos_elaborados>()
                        .Property(p => p.str_nombre_producto)
                        .HasColumnName("str_nombre_producto");
            modelBuilder.Entity<Productos_elaborados>()
                        .Property(p => p.fl_precio_unitario)
                        .HasColumnName("fl_precio_unitario");
            modelBuilder.Entity<Productos_elaborados>()
                        .Property(p => p.fk_recetas)
                        .HasColumnName("fk_recetas");


            //Relaciones entre tablas

            //Un producto elaborado tiene una receta (relacion)
            modelBuilder.Entity<Productos_elaborados>()
                        .HasOne(r => r.Recetas)
                        .WithOne(p => p.Productos_elaborados)
                        .HasForeignKey<Productos_elaborados>(p => p.fk_recetas);

            //Un producto elaborado tiene un producto elaborado stock (relacion)
            modelBuilder.Entity<Productos_elaborados>()
                        .HasOne(p => p.Productos_Elaborados_Stock)
                        .WithOne(p => p.Productos_elaborados)
                        .HasForeignKey<Productos_Elaborados_Stock>(p => p.fk_producto_elaborado);

            //Un producto elaborado tiene muchas ordenes de produccion (relacion)
            modelBuilder.Entity<Productos_elaborados>()
                        .HasMany(p => p.Ordenes_produccion)
                        .WithOne(p => p.Productos_elaborados)
                        .HasForeignKey(p => p.fk_producto_elaborado);
            //un producto elaborado tiene muchos detalles de productos (relacion)
            modelBuilder.Entity<Productos_elaborados>()
                        .HasMany(p => p.Detalles_Productos)
                        .WithOne(p => p.Productos_Elaborados)
                        .HasForeignKey(p => p.fk_producto_elaborado);




            //Detalles de productos
            modelBuilder.Entity<Detalles_Productos>()
                        .HasKey(p => p.id_detalle_producto);
            modelBuilder.Entity<Detalles_Productos>()
                        .Property(p => p.fk_producto_elaborado)
                        .HasColumnName("fk_producto_elaborado");
            modelBuilder.Entity<Detalles_Productos>()
                        .Property(p => p.date_elaboracion)
                        .HasColumnName("date_elaboracion");
            modelBuilder.Entity<Detalles_Productos>()
                        .Property(p => p.date_vencimiento)
                        .HasColumnName("date_vencimiento");
            modelBuilder.Entity<Detalles_Productos>()
                        .Property(p => p.fl_iva)
                        .HasColumnName("fl_iva");

            //Un producto elaborado tiene muchos detalles de productos (relacion)
            modelBuilder.Entity<Detalles_Productos>()
                        .HasOne(p => p.Productos_Elaborados)
                        .WithMany(p => p.Detalles_Productos)
                        .HasForeignKey(p => p.fk_producto_elaborado);

            //Un producto elaborado tiene varios movimientos
            modelBuilder.Entity<Productos_elaborados>()
                        .HasMany(p => p.Movimiento_stock)
                        .WithOne(p => p.Productos_elaborados)
                        .HasForeignKey(p => p.fk_producto_elaborado);

            //Un producto elaborado tiene varios detalles de facturas
            modelBuilder.Entity<Productos_elaborados>()
                        .HasMany(p => p.Detalles_Facturas)
                        .WithOne(p => p.Productos_elaborados)
                        .HasForeignKey(p => p.fk_producto);

            //Tipos de movimientos
            modelBuilder.Entity<Tipos_movimientos>()
                        .HasKey(t => t.id_tipo_movimiento);
            modelBuilder.Entity<Tipos_movimientos>()
                        .Property(t => t.int_movimiento)
                        .HasColumnName("int_movimiento");
            modelBuilder.Entity<Tipos_movimientos>()
                        .Property(t => t.str_tipo)
                        .HasColumnName("str_tipo");

            //Movimiento Stock
            modelBuilder.Entity<Movimiento_stock>()
                        .HasKey(m => m.id_transferencia_stock);
            modelBuilder.Entity<Movimiento_stock>()
                        .Property(m => m.fk_producto_elaborado)
                        .HasColumnName("fk_producto_elaborado");
            modelBuilder.Entity<Movimiento_stock>()
                        .Property(m => m.fk_stock)
                        .HasColumnName("fk_stock");
            modelBuilder.Entity<Movimiento_stock>()
                        .Property(m => m.fk_tipo_movimiento)
                        .HasColumnName("fk_tipo_movimiento");
            modelBuilder.Entity<Movimiento_stock>()
                        .Property(m => m.int_cantidad)
                        .HasColumnName("int_cantidad");
            modelBuilder.Entity<Movimiento_stock>()
                        .Property(m => m.date_fecha_ingreso)
                        .HasColumnName("date_fecha_ingreso");


            //Relaciones de entre las tablas
            //Un movimiento de stock puede tener un tipo de movimiento
            modelBuilder.Entity<Movimiento_stock>()
                        .HasOne(m => m.Tipos_movimientos)
                        .WithMany(t => t.Movimiento_stock)
                        .HasForeignKey(m => m.fk_tipo_movimiento);

            //Un movimiento de stock puede tener un producto elaborado
            modelBuilder.Entity<Movimiento_stock>()
                        .HasOne(m => m.Productos_elaborados)
                        .WithMany(p => p.Movimiento_stock)
                        .HasForeignKey(m => m.fk_producto_elaborado);

            //Un movimiento de stock puede tener un stock
            modelBuilder.Entity<Movimiento_stock>()
                        .HasOne(m => m.Stocks)
                        .WithMany(s => s.Movimiento_stock)
                        .HasForeignKey(m => m.fk_stock);

            //Tipos de movimientos
            modelBuilder.Entity<Tipos_movimientos>()
                        .HasKey(t => t.id_tipo_movimiento);
            modelBuilder.Entity<Tipos_movimientos>()
                        .Property(t => t.int_movimiento)
                        .HasColumnName("int_movimiento");
            modelBuilder.Entity<Tipos_movimientos>()
                        .Property(t => t.str_tipo)
                        .HasColumnName("str_tipo");

            //Un tipos_movimientos puede tener muchos movimientos_stock
            modelBuilder.Entity<Tipos_movimientos>()
                        .HasMany(t => t.Movimiento_stock)
                        .WithOne(m => m.Tipos_movimientos)
                        .HasForeignKey(m => m.fk_tipo_movimiento);
        }
    }
}