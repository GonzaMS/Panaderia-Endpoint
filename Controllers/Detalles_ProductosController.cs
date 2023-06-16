using Panaderia.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Panaderia.Data;

namespace Panaderia.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Detalles_ProductosController : ControllerBase
    {
        private readonly ProductosyMovimientosDbContext _context;

        public Detalles_ProductosController(ProductosyMovimientosDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Detalles_Productos>>> GetDetalles_Productos()
        {
            return await _context.Detalles_productos.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Detalles_Productos>> GetDetalles_Productos(int id)
        {
            var detalles_productos = await _context.Detalles_productos.FindAsync(id);

            if (detalles_productos == null)
            {
                return NotFound();
            }

            return detalles_productos;
        }

        [HttpPost]
        public async Task<ActionResult<Detalles_Productos>> PostDetalles_Productos(Detalles_Productos detalles_productos)
        {
            _context.Detalles_productos.Add(detalles_productos);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDetalles_Productos", new { id = detalles_productos.id_detalle_producto }, detalles_productos);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutDetalles_Productos(int id, Detalles_Productos detalles_Productos)
        {
            if (id != detalles_Productos.id_detalle_producto)
            {
                return BadRequest();
            }

            _context.Entry(detalles_Productos).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!Detalles_ProductosExists(id))
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
        public async Task<ActionResult<Detalles_Productos>> DeleteDetalles_Productos(int id)
        {
            var detalles_productos = await _context.Detalles_productos.FindAsync(id);
            if (detalles_productos == null)
            {
                return NotFound();
            }

            _context.Detalles_productos.Remove(detalles_productos);
            await _context.SaveChangesAsync();

            return detalles_productos;
        }

        private bool Detalles_ProductosExists(int id)
        {
            return _context.Detalles_productos.Any(e => e.id_detalle_producto == id);
        }
    }
}