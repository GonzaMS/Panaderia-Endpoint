using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Panaderia.Data;
using Panaderia.Models;

namespace Panaderia.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Productos_Elaborados_StockController : ControllerBase
    {
        private readonly StocksDbContext _context;

        public Productos_Elaborados_StockController(StocksDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Productos_Elaborados_Stock>>> GetProductos_Elaborados_Stock()
        {
            return await _context.Productos_Elaborados_Stock.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Productos_Elaborados_Stock>> GetProductos_Elaborados_Stock(int id)
        {
            var productos_Elaborados_Stock = await _context.Productos_Elaborados_Stock.FindAsync(id);

            if (productos_Elaborados_Stock == null)
            {
                return NotFound();
            }

            return productos_Elaborados_Stock;
        }

        [HttpPost]
        public async Task<ActionResult<Productos_Elaborados_Stock>> PostProductos_Elaborados_Stock(Productos_Elaborados_Stock productos_Elaborados_Stock)
        {
            _context.Productos_Elaborados_Stock.Add(productos_Elaborados_Stock);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetProductos_Elaborados_Stock", new { id = productos_Elaborados_Stock.id_producto_stock }, productos_Elaborados_Stock);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutProductos_Elaborados_Stock(int id, Productos_Elaborados_Stock productos_Elaborados_Stock)
        {
            if (id != productos_Elaborados_Stock.id_producto_stock)
            {
                return BadRequest();
            }

            _context.Entry(productos_Elaborados_Stock).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!Productos_Elaborados_StockExists(id))
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
        public async Task<ActionResult<Productos_Elaborados_Stock>> DeleteProductos_Elaborados_Stock(int id)
        {
            var productos_Elaborados_Stock = await _context.Productos_Elaborados_Stock.FindAsync(id);
            if (productos_Elaborados_Stock == null)
            {
                return NotFound();
            }

            _context.Productos_Elaborados_Stock.Remove(productos_Elaborados_Stock);
            await _context.SaveChangesAsync();

            return productos_Elaborados_Stock;
        }

        private bool Productos_Elaborados_StockExists(int id)
        {
            return _context.Productos_Elaborados_Stock.Any(e => e.id_producto_stock == id);
        }

    }
}