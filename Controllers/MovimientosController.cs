using Panaderia.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Panaderia.Data;

namespace Panaderia.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MovimientosController : ControllerBase
    {
        private readonly CobrosDbContext _context;

        public MovimientosController(CobrosDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Movimientos>>> GetMovimientos()
        {
            return await _context.Movimientos.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Movimientos>> GetMovimientos(int id)
        {
            var movimientos = await _context.Movimientos.FindAsync(id);

            if (movimientos == null)
            {
                return NotFound();
            }

            return movimientos;
        }

        [HttpPost]
        public async Task<ActionResult<Movimientos>> PostMovimientos(Movimientos movimientos)
        {
            _context.Movimientos.Add(movimientos);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetMovimientos", new { id = movimientos.id_movimiento }, movimientos);
        }


        [HttpPut("{id}")]

        public async Task<IActionResult> PutMovimientos(int id, Movimientos movimientos)
        {
            if (id != movimientos.id_movimiento)
            {
                return BadRequest();
            }

            _context.Entry(movimientos).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MovimientosExists(id))
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
        public async Task<ActionResult<Movimientos>> DeleteMovimientos(int id)
        {
            var movimientos = await _context.Movimientos.FindAsync(id);
            if (movimientos == null)
            {
                return NotFound();
            }

            _context.Movimientos.Remove(movimientos);
            await _context.SaveChangesAsync();

            return movimientos;
        }

        private bool MovimientosExists(int id)
        {
            return _context.Movimientos.Any(e => e.id_movimiento == id);
        }
    }
}