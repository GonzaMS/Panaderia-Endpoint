using Panaderia.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Panaderia.Data;

namespace Panaderia.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Detalles_CajasController : ControllerBase
    {
        private readonly CajasDbContext _context;

        public Detalles_CajasController(CajasDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Detalles_cajas>>> Detalles_cajas()
        {
            return await _context.Detalles_Cajas.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Detalles_cajas>> GetDetalles_cajas(int id)
        {
            var detalles_cajas = await _context.Detalles_Cajas.FindAsync(id);

            if (detalles_cajas == null)
            {
                return NotFound();
            }

            return detalles_cajas;
        }

        [HttpPost]
        public async Task<ActionResult<Detalles_cajas>> PostDetalles_cajas(Detalles_cajas detalles_cajas)
        {
            _context.Detalles_Cajas.Add(detalles_cajas);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDetalles_cajas", new { id = detalles_cajas.id_detalle_caja }, detalles_cajas);
        }

        [HttpPut("{id}")]

        public async Task<IActionResult> PutDetalles_cajas(int id, Detalles_cajas detalles_cajas)
        {
            if (id != detalles_cajas.id_detalle_caja)
            {
                return BadRequest();
            }

            _context.Entry(detalles_cajas).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!Detalles_cajasExists(id))
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
        public async Task<ActionResult<Detalles_cajas>> DeleteDetalles_cajas(int id)
        {
            var detalles_cajas = await _context.Detalles_Cajas.FindAsync(id);
            if (detalles_cajas == null)
            {
                return NotFound();
            }

            _context.Detalles_Cajas.Remove(detalles_cajas);
            await _context.SaveChangesAsync();

            return detalles_cajas;
        }

        private bool Detalles_cajasExists(int id)
        {
            return _context.Detalles_Cajas.Any(e => e.id_detalle_caja == id);
        }
    }
}