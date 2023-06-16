using Panaderia.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Panaderia.Data;

namespace Panaderia.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Detalles_arqueosController : ControllerBase
    {
        private readonly ArqueosDbContext _context;

        public Detalles_arqueosController(ArqueosDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Detalles_arqueos>>> GetDetalles_arqueos()
        {
            return await _context.Detalles_Arqueos.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Detalles_arqueos>> GetDetalles_arqueos(int id)
        {
            var detalles_arqueos = await _context.Detalles_Arqueos.FindAsync(id);

            if (detalles_arqueos == null)
            {
                return NotFound();
            }

            return detalles_arqueos;
        }

        [HttpPost]
        public async Task<ActionResult<Detalles_arqueos>> PostDetalles_arqueos(Detalles_arqueos detalles_arqueos)
        {
            _context.Detalles_Arqueos.Add(detalles_arqueos);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDetalles_arqueos", new { id = detalles_arqueos.id_detalle_arqueo }, detalles_arqueos);
        }

        [HttpPut("{id}")]

        public async Task<IActionResult> PutDetalles_arqueos(int id, Detalles_arqueos detalles_arqueos)
        {
            if (id != detalles_arqueos.id_detalle_arqueo)
            {
                return BadRequest();
            }

            _context.Entry(detalles_arqueos).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!Detalles_arqueosExists(id))
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
        public async Task<ActionResult<Detalles_arqueos>> DeleteDetalles_arqueos(int id)
        {
            var detalles_arqueos = await _context.Detalles_Arqueos.FindAsync(id);
            if (detalles_arqueos == null)
            {
                return NotFound();
            }

            _context.Detalles_Arqueos.Remove(detalles_arqueos);
            await _context.SaveChangesAsync();

            return detalles_arqueos;
        }

        private bool Detalles_arqueosExists(int id)
        {
            return _context.Detalles_Arqueos.Any(e => e.id_detalle_arqueo == id);
        }
    }
}