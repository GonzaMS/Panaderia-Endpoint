using Panaderia.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Panaderia.Data;

namespace Panaderia.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class ComprasController : ControllerBase
    {
        private readonly ComprasDbContext _context;

        public ComprasController(ComprasDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Compras>>> GetCompras()
        {
            return await _context.Compras.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Compras>> GetCompras(int id)
        {
            var compras = await _context.Compras.FindAsync(id);

            if (compras == null)
            {
                return NotFound();
            }

            return compras;
        }

        [HttpPost]
        public async Task<ActionResult<Compras>> PostCompras(Compras compras)
        {
            _context.Compras.Add(compras);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCompras", new { id = compras.id_compra }, compras);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutCompras(int id, Compras compras)
        {
            if (id != compras.id_compra)
            {
                return BadRequest();
            }

            _context.Entry(compras).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ComprasExists(id))
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
        public async Task<ActionResult<Compras>> DeleteCompras(int id)
        {
            var compras = await _context.Compras.FindAsync(id);
            if (compras == null)
            {
                return NotFound();
            }

            _context.Compras.Remove(compras);
            await _context.SaveChangesAsync();

            return compras;
        }

        //Buscar por fecha
        [HttpGet("fecha/{fecha}")]
        public async Task<ActionResult<IEnumerable<Compras>>> GetComprasFecha(DateTime fecha)
        {
            var compras = await _context.Compras.Where(p => p.date_compra == fecha).ToListAsync();

            if (compras == null)
            {
                return NotFound();
            }

            return compras;
        }

        private bool ComprasExists(int id)
        {
            return _context.Compras.Any(e => e.id_compra == id);
        }

    }
}