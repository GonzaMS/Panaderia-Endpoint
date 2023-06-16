using Panaderia.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Panaderia.Data;

namespace Panaderia.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CajasController : ControllerBase
    {
        private readonly CajasDbContext _context;

        public CajasController(CajasDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Cajas>>> GetCajas()
        {
            return await _context.Cajas.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Cajas>> GetCajas(int id)
        {
            var cajas = await _context.Cajas.FindAsync(id);

            if (cajas == null)
            {
                return NotFound();
            }

            return cajas;
        }

        [HttpPost]
        public async Task<ActionResult<Cajas>> PostCajas(Cajas cajas)
        {
            _context.Cajas.Add(cajas);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCajas", new { id = cajas.id_cajas }, cajas);
        }

        [HttpPut("{id}")]

        public async Task<IActionResult> PutCajas(int id, Cajas cajas)
        {
            if (id != cajas.id_cajas)
            {
                return BadRequest();
            }

            _context.Entry(cajas).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CajasExists(id))
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
        public async Task<ActionResult<Cajas>> DeleteCajas(int id)
        {
            var cajas = await _context.Cajas.FindAsync(id);
            if (cajas == null)
            {
                return NotFound();
            }

            _context.Cajas.Remove(cajas);
            await _context.SaveChangesAsync();

            return cajas;
        }
        private bool CajasExists(int id)
        {
            return _context.Cajas.Any(e => e.id_cajas == id);
        }
    }
}