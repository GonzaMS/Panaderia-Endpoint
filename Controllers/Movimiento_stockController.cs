using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Panaderia.Data;
using Panaderia.Models;

namespace Panaderia.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Movimiento_StockController : ControllerBase
    {

        private readonly ProductosyMovimientosDbContext _context;

        public Movimiento_StockController(ProductosyMovimientosDbContext dbContext)
        {
            _context = dbContext;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Movimiento_stock>>> GetMovimiento_stock()
        {
            return await _context.Movimiento_stock.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Movimiento_stock>> GetMovimiento_stock(int id)
        {
            var Movimiento_stock = await _context.Movimiento_stock.FindAsync(id);

            if (Movimiento_stock == null)
            {
                return NotFound();
            }

            return Movimiento_stock;
        }

        [HttpPost]
        public async Task<ActionResult<Movimiento_stock>> PostMovimiento_stock(Movimiento_stock Movimiento_stock)
        {
            _context.Movimiento_stock.Add(Movimiento_stock);
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                "GetMovimiento_stock",
                new { id = Movimiento_stock.id_transferencia_stock },
                Movimiento_stock
            );
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutMovimiento_stock(int id, Movimiento_stock Movimiento_stock)
        {
            if (id != Movimiento_stock.id_transferencia_stock)
            {
                return BadRequest();
            }

            _context.Entry(Movimiento_stock).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!Movimiento_stockExist(id))
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
        public async Task<IActionResult> DeleteMovimiento_stock(int id)
        {
            var Movimiento_stock = await _context.Movimiento_stock.FindAsync(id);
            if (Movimiento_stock == null)
            {
                return NotFound();
            }

            _context.Movimiento_stock.Remove(Movimiento_stock);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool Movimiento_stockExist(int id)
        {
            return _context.Movimiento_stock.Any(e => e.id_transferencia_stock == id);
        }

    }
}