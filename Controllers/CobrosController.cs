using Panaderia.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Panaderia.Data;

namespace Panaderia.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class CobrosController : ControllerBase
    {
        private readonly CobrosDbContext _context;

        public CobrosController(CobrosDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Cobros>>> GetCobros()
        {
            return await _context.Cobros.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Cobros>> GetCobros(int id)
        {
            var cobros = await _context.Cobros.FindAsync(id);

            if (cobros == null)
            {
                return NotFound();
            }

            return cobros;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutCobros(int id, Cobros cobros)
        {
            if (id != cobros.id_cobro)
            {
                return BadRequest();
            }

            _context.Entry(cobros).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CobrosExists(id))
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

        [HttpPost]
        public async Task<ActionResult<Cobros>> PostCobros(Cobros cobros)
        {
            _context.Cobros.Add(cobros);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCobros", new { id = cobros.id_cobro }, cobros);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Cobros>> DeleteCobros(int id)
        {
            var cobros = await _context.Cobros.FindAsync(id);
            if (cobros == null)
            {
                return NotFound();
            }

            _context.Cobros.Remove(cobros);
            await _context.SaveChangesAsync();

            return cobros;
        }

        private bool CobrosExists(int id)
        {
            return _context.Cobros.Any(e => e.id_cobro == id);
        }

    }
}