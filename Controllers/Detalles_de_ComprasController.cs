using Panaderia.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Panaderia.Data;

namespace Panaderia.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Detalles_de_comprasController : ControllerBase
    {
        private readonly ComprasDbContext _context;

        public Detalles_de_comprasController(ComprasDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Detalles_de_compras>>> GetDetalles_de_compras()
        {
            return await _context.Detalles_de_compras.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Detalles_de_compras>> Detalles_de_compras(int id)
        {
            var detalles_de_compras = await _context.Detalles_de_compras.FindAsync(id);

            if (detalles_de_compras == null)
            {
                return NotFound();
            }

            return detalles_de_compras;
        }

        [HttpPost]
        public async Task<ActionResult<Detalles_de_compras>> PostDetalles_de_compras(Detalles_de_compras detalles_de_compras)
        {
            _context.Detalles_de_compras.Add(detalles_de_compras);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDetalles_de_compras", new { id = detalles_de_compras.id_detalle_compra }, detalles_de_compras);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutDetalles_de_compras(int id, Detalles_de_compras detalles_de_compras)
        {
            if (id != detalles_de_compras.id_detalle_compra)
            {
                return BadRequest();
            }

            _context.Entry(detalles_de_compras).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!Detalles_ComprasExists(id))
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
        public async Task<ActionResult<Detalles_de_compras>> DeleteDetalles_de_compras(int id)
        {
            var detalles_de_compras = await _context.Detalles_de_compras.FindAsync(id);
            if (detalles_de_compras == null)
            {
                return NotFound();
            }

            _context.Detalles_de_compras.Remove(detalles_de_compras);
            await _context.SaveChangesAsync();

            return detalles_de_compras;
        }

        private bool Detalles_ComprasExists(int id)
        {
            return _context.Detalles_de_compras.Any(e => e.id_detalle_compra == id);
        }
    }
}