using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;
using Panaderia.Data;
using Panaderia.Models;

namespace Panaderia.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Productos_ElaboradosController : ControllerBase
    {
        private readonly ProductosyMovimientosDbContext _context;

        public Productos_ElaboradosController(ProductosyMovimientosDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Productos_elaborados>>> GetProductos_elaborados()
        {
            return await _context.Productos_elaborados.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Productos_elaborados>> GetProductos_elaborados(int id)
        {
            var productos_elaborados = await _context.Productos_elaborados.FindAsync(id);

            if (productos_elaborados == null)
            {
                return NotFound();
            }

            return productos_elaborados;
        }

        [HttpPost]
        public async Task<ActionResult<Productos_elaborados>> PostProductos_elaborados(Productos_elaborados productos_elaborados)
        {
            _context.Productos_elaborados.Add(productos_elaborados);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetProductos_elaborados", new { id = productos_elaborados.id_producto_elaborado }, productos_elaborados);
        }

        //Api put
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProductosElaborados(int id, Productos_elaborados producto)
        {
            if (id != producto.id_producto_elaborado)
            {
                return BadRequest();
            }

            _context.Entry(producto).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!Productos_elaboradosExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Productos_elaborados>> DeleteProductos_elaborados(int id)
        {
            var productos_elaborados = await _context.Productos_elaborados.FindAsync(id);
            if (productos_elaborados == null)
            {
                return NotFound();
            }

            // Delete related records from detalles_productos table
            var detallesToDelete = _context.Detalles_productos.Where(d => d.fk_producto_elaborado == id).ToList();
            _context.Detalles_productos.RemoveRange(detallesToDelete);
            await _context.SaveChangesAsync();

            _context.Productos_elaborados.Remove(productos_elaborados);
            await _context.SaveChangesAsync();

            return productos_elaborados;
        }

        //Buscar un producto elaborado por nombre
        [HttpGet("Buscar/{nombre}")]
        public async Task<ActionResult<IEnumerable<Productos_elaborados>>> GetProductos_elaborados(string nombre)
        {
            var productos_elaborados = await _context.Productos_elaborados
                .Where(p => p.str_nombre_producto.Contains(nombre))
                .ToListAsync();

            if (productos_elaborados == null)
            {
                return NotFound();
            }

            return productos_elaborados;
        }

        private bool Productos_elaboradosExists(int id)
        {
            return _context.Productos_elaborados.Any(e => e.id_producto_elaborado == id);
        }

    }
}