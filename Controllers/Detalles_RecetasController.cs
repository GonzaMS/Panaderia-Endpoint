using Panaderia.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Panaderia.Data;

namespace Panaderia.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Detalles_RecetasController : ControllerBase
    {
        private readonly RecetasDbContext _context;

        public Detalles_RecetasController(RecetasDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Detalles_Recetas>>> GetDetalles_Recetas()
        {
            return await _context.Detalles_Recetas.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Detalles_Recetas>> GetDetalles_Recetas(int id)
        {
            var detalles_Recetas = await _context.Detalles_Recetas.FindAsync(id);

            if (detalles_Recetas == null)
            {
                return NotFound();
            }

            return detalles_Recetas;
        }

        [HttpPost]
        public async Task<ActionResult<Detalles_Recetas>> PostDetalles_Recetas(Detalles_Recetas detalles_Recetas)
        {
            _context.Detalles_Recetas.Add(detalles_Recetas);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDetalles_Recetas", new { id = detalles_Recetas.id_detalle_receta }, detalles_Recetas);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutDetalles_Recetas(int id, Detalles_Recetas detalles_Recetas)
        {
            if (id != detalles_Recetas.id_detalle_receta)
            {
                return BadRequest();
            }

            _context.Entry(detalles_Recetas).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!Detalles_RecetasExists(id))
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
        public async Task<ActionResult<Detalles_Recetas>> DeleteDetalles_Recetas(int id)
        {
            var detalles_Recetas = await _context.Detalles_Recetas.FindAsync(id);
            if (Detalles_RecetasExists == null)
            {
                return NotFound();
            }

            _context.Detalles_Recetas.Remove(detalles_Recetas);
            await _context.SaveChangesAsync();

            return detalles_Recetas;
        }

        private bool Detalles_RecetasExists(int id)
        {
            return _context.Detalles_Recetas.Any(e => e.id_detalle_receta == id);
        }
    }
}