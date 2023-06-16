using Panaderia.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Panaderia.Data;

namespace Panaderia.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CajerosController : ControllerBase
    {
        private readonly CajasDbContext _context;

        public CajerosController(CajasDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Cajeros>>> GetCajeros()
        {
            return await _context.Cajeros.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Cajeros>> GetCajeros(int id)
        {
            var cajeros = await _context.Cajeros.FindAsync(id);

            if (cajeros == null)
            {
                return NotFound();
            }

            return cajeros;
        }

        [HttpPost]
        public async Task<ActionResult<Cajeros>> PostCajeros(Cajeros cajeros)
        {
            _context.Cajeros.Add(cajeros);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCajeros", new { id = cajeros.id_cajero }, cajeros);
        }

        [HttpPut("{id}")]

        public async Task<IActionResult> PutCajeros(int id, Cajeros cajeros)
        {
            if (id != cajeros.id_cajero)
            {
                return BadRequest();
            }

            _context.Entry(cajeros).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CajerosExists(id))
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
        public async Task<ActionResult<Cajeros>> DeleteCajeros(int id)
        {
            var cajeros = await _context.Cajeros.FindAsync(id);
            if (cajeros == null)
            {
                return NotFound();
            }

            _context.Cajeros.Remove(cajeros);
            await _context.SaveChangesAsync();

            return cajeros;
        }

        //Buscar un cajero por nombre
        [HttpGet("Buscar/{nombre}")]
        public async Task<ActionResult<IEnumerable<Cajeros>>> GetCajeros(string nombre)
        {
            var cajeros = await _context.Cajeros
                .Where(p => p.str_nombre_cajero.Contains(nombre))
                .ToListAsync();

            if (cajeros == null)
            {
                return NotFound();
            }

            return cajeros;
        }

        private bool CajerosExists(int id)
        {
            return _context.Cajeros.Any(e => e.id_cajero == id);
        }
    }
}