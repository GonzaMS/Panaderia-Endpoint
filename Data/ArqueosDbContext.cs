using Panaderia.Models;
using Microsoft.EntityFrameworkCore;

//apii
namespace Panaderia.Data
{
    public class ArqueosDbContext : DbContext
    {
        public DbSet<Billetes> Billetes { get; set; }
        public DbSet<Detalles_efectivos> Detalles_Efectivos { get; set; }
        public DbSet<Detalles_arqueos> Detalles_Arqueos { get; set; }
        public DbSet<Arqueos> Arqueos { get; set; }

        public ArqueosDbContext(DbContextOptions<ArqueosDbContext> options) : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //Billetes
            modelBuilder.Entity<Billetes>()
                        .HasKey(p => p.id_billete);
            modelBuilder.Entity<Billetes>()
                        .Property(p => p.str_numero_divisa)
                        .HasColumnName("str_numero_divisa");
            modelBuilder.Entity<Billetes>()
                        .Property(p => p.str_tamanho_efectivo)
                        .HasColumnName("str_tamanho_efectivo");

            //Detalles efectivos
            modelBuilder.Entity<Detalles_efectivos>()
                        .HasKey(p => p.id_detalles_efectivos);
            modelBuilder.Entity<Detalles_efectivos>()
                        .Property(p => p.fk_billete)
                        .HasColumnName("fk_billete");
            modelBuilder.Entity<Detalles_efectivos>()
                        .Property(p => p.int_cantidad_billete)
                        .HasColumnName("int_cantidad_billete");
            modelBuilder.Entity<Detalles_efectivos>()
                        .Property(p => p.fk_detalle_arqueo)
                        .HasColumnName("fk_detalle_arqueo");
            modelBuilder.Entity<Detalles_efectivos>()
                        .Property(p => p.int_total_billete)
                        .HasColumnName("int_total_billete");

            //Arqueo
            modelBuilder.Entity<Arqueos>()
                        .HasKey(a => a.id_arqueo);
            modelBuilder.Entity<Arqueos>()
                        .Property(a => a.fk_detalle_cajas)
                        .HasColumnName("fk_detalle_cajas");
            modelBuilder.Entity<Arqueos>()
                        .Property(a => a.fk_cajero)
                        .HasColumnName("fk_cajero");
            modelBuilder.Entity<Arqueos>()
                        .Property(a => a.str_descripcion)
                        .HasColumnName("str_descripcion");

            //Detalles_arqueos
            modelBuilder.Entity<Detalles_arqueos>()
                        .HasKey(d => d.id_detalle_arqueo);
            modelBuilder.Entity<Detalles_arqueos>()
                        .Property(d => d.fk_arqueo)
                        .HasColumnName("fk_arqueo");
            modelBuilder.Entity<Detalles_arqueos>()
                        .Property(d => d.fl_total)
                        .HasColumnName("fl_total");

            //Relaciones entre tablas

            //Un billete tiene varios detalles_efectivos
            modelBuilder.Entity<Detalles_efectivos>()
                        .HasOne<Billetes>(b => b.Billetes)
                        .WithMany(d => d.Detalles_efectivos)
                        .HasForeignKey(b => b.fk_billete);

            //un detalle_efectivo tiene un billete
            modelBuilder.Entity<Billetes>()
                        .HasMany<Detalles_efectivos>(d => d.Detalles_efectivos)
                        .WithOne(b => b.Billetes)
                        .HasForeignKey(d => d.fk_billete);

            //un detalle_arqueos tiene varios detalles_efectivos
            modelBuilder.Entity<Detalles_efectivos>()
                        .HasOne<Detalles_arqueos>(d => d.Detalles_arqueos)
                        .WithMany(d => d.Detalles_efectivos)
                        .HasForeignKey(d => d.fk_detalle_arqueo);

            //un detalle_efectivo tiene un detalle_arqueo
            modelBuilder.Entity<Detalles_arqueos>()
                        .HasMany<Detalles_efectivos>(d => d.Detalles_efectivos)
                        .WithOne(d => d.Detalles_arqueos)
                        .HasForeignKey(d => d.fk_detalle_arqueo);

            //un arqueo tiene varios detalles_arqueos
            modelBuilder.Entity<Detalles_arqueos>()
                        .HasOne<Arqueos>(a => a.Arqueos)
                        .WithMany(d => d.Detalles_arqueos)
                        .HasForeignKey(a => a.fk_arqueo);

            //un detalle_arqueo tiene un arqueo
            modelBuilder.Entity<Arqueos>()
                        .HasMany<Detalles_arqueos>(d => d.Detalles_arqueos)
                        .WithOne(a => a.Arqueos)
                        .HasForeignKey(d => d.fk_arqueo);

            //Un arqueo tiene un cajero
            modelBuilder.Entity<Arqueos>()
                        .HasOne<Cajeros>(c => c.Cajero)
                        .WithMany(a => a.Arqueos)
                        .HasForeignKey(c => c.fk_cajero);

            //Un arqeo tiene un detalles cajas
            modelBuilder.Entity<Detalles_cajas>()
                        .HasOne<Arqueos>(a => a.Arqueos)
                        .WithOne(d => d.Detalles_cajas)
                        .HasForeignKey<Arqueos>(a => a.fk_detalle_cajas);

        }
    }
}