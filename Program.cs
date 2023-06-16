using MySqlConnector;
using Panaderia.Context;
using Panaderia.DatabaseTriggers;

namespace Panaderia.Main
{
    public class Program
    {
        //Metodo Main
        public static void Main(string[] args)
        {
            // Creamos el contexto de la base de datos
            CreateHostBuilder(args).Build().Run();
        }

        // Configuramos el host
        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Program>();
                });

        // Configuramos el servicio de la base de datos
        public void ConfigureServices(IServiceCollection services)
        {
            // MySQL Connection String
            var connectionString = "Server=panaderia.mysql.database.azure.com;Database=panaderia;Port=3306;user=databasepanaderia;Password=Admin123$;SSL Mode=Required";

            // Creamos la conexion a la base de datos
            var connection = new MySqlConnection(connectionString);

            // Configuramos el servicio de la base de datos
            services.ConfigurePanaderiaServices(connectionString);

        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthorization();

            app.UseCors(builder => builder
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}