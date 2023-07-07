using Panaderia.Models;
using Microsoft.EntityFrameworkCore;


namespace Panaderia.Data
{
    public class CajasDbContext : DbContext
    {
        public DbSet<Cajas> Cajas { get; set; }
        public DbSet<Cajeros> Cajeros { get; set; }
        public DbSet<Detalles_cajas> Detalles_Cajas { get; set; }

        public CajasDbContext(DbContextOptions<CajasDbContext> options) : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Caja
            modelBuilder.Entity<Cajas>()
                        .HasKey(c => c.id_cajas);
            modelBuilder.Entity<Cajas>()
                        .Property(c => c.str_numero_caja)
                        .HasColumnName("str_numero_caja");

            // Cajeros
            modelBuilder.Entity<Cajeros>()
                        .HasKey(c => c.id_cajero);
            modelBuilder.Entity<Cajeros>()
                        .Property(c => c.str_nombre_cajero)
                        .HasColumnName("str_nombre_cajero");

            //Detalles_cajas
            modelBuilder.Entity<Detalles_cajas>()
                        .HasKey(d => d.id_detalle_caja);
            modelBuilder.Entity<Detalles_cajas>()
                        .Property(d => d.fk_caja)
                        .HasColumnName("fk_caja");
            modelBuilder.Entity<Detalles_cajas>()
                        .Property(d => d.fl_monto_caja)
                        .HasColumnName("fl_monto_caja");
            modelBuilder.Entity<Detalles_cajas>()
                        .Property(d => d.date_fecha_del_dia)
                        .HasColumnName("date_fecha_del_dia");
            modelBuilder.Entity<Detalles_cajas>()
                        .Property(d => d.fk_cajero)
                        .HasColumnName("fk_cajero");
            modelBuilder.Entity<Detalles_cajas>()
                        .Property(d => d.date_hora_entrada)
                        .HasColumnName("date_hora_entrada");
            modelBuilder.Entity<Detalles_cajas>()
                        .Property(d => d.date_hora_salida)
                        .HasColumnName("date_hora_salida");
            modelBuilder.Entity<Detalles_cajas>()
                        .Property(d => d.bool_estado_caja)
                        .HasColumnName("bool_estado_caja");

            //Relaciones entre tablass

            //una caja tiene varias detalles_cajas
            modelBuilder.Entity<Detalles_cajas>()
                        .HasOne<Cajas>(c => c.Cajas)
                        .WithMany(d => d.Detalles_cajas)
                        .HasForeignKey(c => c.fk_caja);
            //un detalle_caja tiene un caja
            modelBuilder.Entity<Cajas>()
                        .HasMany<Detalles_cajas>(d => d.Detalles_cajas)
                        .WithOne(c => c.Cajas)
                        .HasForeignKey(d => d.fk_caja);

            //un detalle_caja tiene un cajero
            modelBuilder.Entity<Cajeros>()
                        .HasMany<Detalles_cajas>(d => d.Detalles_cajas)
                        .WithOne(c => c.Cajeros)
                        .HasForeignKey(d => d.fk_cajero);

            //un cajero tiene varias detalles_cajas
            modelBuilder.Entity<Detalles_cajas>()
                        .HasOne<Cajeros>(c => c.Cajeros)
                        .WithMany(d => d.Detalles_cajas)
                        .HasForeignKey(c => c.fk_cajero);

            //Un cajero tiene varios arqueos
            modelBuilder.Entity<Arqueos>()
                        .HasOne<Cajeros>(c => c.Cajero)
                        .WithMany(a => a.Arqueos)
                        .HasForeignKey(c => c.fk_cajero);

            //Un detalles cajas tiene un arqueo
            //modelBuilder.Entity<Arqueos>()
            //          .HasOne<Detalles_cajas>(d => d.Detalles_cajas)
            //        .WithOne(a => a.Arqueos)
            //      .HasForeignKey<Detalles_cajas>(d => d.id_detalle_caja);

            //Un detallles cajas tiene varios movimientos
            modelBuilder.Entity<Movimientos>()
                        .HasOne<Detalles_cajas>(d => d.Detalles_cajas)
                        .WithMany(m => m.Movimientos)
                        .HasForeignKey(d => d.fk_detalle_caja);


        }
    }
}