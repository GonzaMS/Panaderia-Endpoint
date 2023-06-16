using Panaderia.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Panaderia.Data;

namespace Panaderia.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class Detalles_EfectivosController : ControllerBase
    {
        private readonly ArqueosDbContext _context;

        public Detalles_EfectivosController(ArqueosDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Detalles_efectivos>>> GetDetalles_Efectivos()
        {
            return await _context.Detalles_Efectivos.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Detalles_efectivos>> GetDetalles_Efectivos(int id)
        {
            var detalles_efectivos = await _context.Detalles_Efectivos.FindAsync(id);

            if (detalles_efectivos == null)
            {
                return NotFound();
            }

            return detalles_efectivos;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutDetalles_Efectivos(int id, Detalles_efectivos detalles_efectivos)
        {
            if (id != detalles_efectivos.id_detalles_efectivos)
            {
                return BadRequest();
            }

            _context.Entry(detalles_efectivos).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!Detalles_EfectivosExists(id))
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
        public async Task<ActionResult<Detalles_efectivos>> PostDetalles_Efectivos(Detalles_efectivos detalles_efectivos)
        {
            _context.Detalles_Efectivos.Add(detalles_efectivos);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDetalles_Efectivos", new { id = detalles_efectivos.id_detalles_efectivos }, detalles_efectivos);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Detalles_efectivos>> DeleteDetalles_Efectivos(int id)
        {
            var detalles_efectivos = await _context.Detalles_Efectivos.FindAsync(id);
            if (detalles_efectivos == null)
            {
                return NotFound();
            }

            _context.Detalles_Efectivos.Remove(detalles_efectivos);
            await _context.SaveChangesAsync();

            return detalles_efectivos;
        }

        private bool Detalles_EfectivosExists(int id)
        {
            return _context.Detalles_Efectivos.Any(e => e.id_detalles_efectivos == id);
        }

    }
}