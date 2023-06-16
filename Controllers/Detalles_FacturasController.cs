using Panaderia.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Panaderia.Data;

namespace Panaderia.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Detalles_FacturasController : ControllerBase
    {
        private readonly FacturasDbContext _context;

        public Detalles_FacturasController(FacturasDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Detalles_Facturas>>> GetDetalles_Facturas()
        {
            return await _context.Detalles_Facturas.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Detalles_Facturas>> GetDetalles_Facturas(int id)
        {
            var detalles_facturas = await _context.Detalles_Facturas.FindAsync(id);

            if (detalles_facturas == null)
            {
                return NotFound();
            }

            return detalles_facturas;
        }

        [HttpPost]
        public async Task<ActionResult<Detalles_Facturas>> PostDetalles_Facturas(Detalles_Facturas detalles_facturas)
        {
            _context.Detalles_Facturas.Add(detalles_facturas);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDetalles_Facturas", new { id = detalles_facturas.id_detalle_factura }, detalles_facturas);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutDetalles_Facturas(int id, Detalles_Facturas detalles_facturas)
        {
            if (id != detalles_facturas.id_detalle_factura)
            {
                return BadRequest();
            }

            _context.Entry(detalles_facturas).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!Detalles_FacturasExists(id))
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
        public async Task<ActionResult<Detalles_Facturas>> DeleteDetalles_Facturas(int id)
        {
            var detalles_facturas = await _context.Detalles_Facturas.FindAsync(id);
            if (detalles_facturas == null)
            {
                return NotFound();
            }

            _context.Detalles_Facturas.Remove(detalles_facturas);
            await _context.SaveChangesAsync();

            return detalles_facturas;
        }

        private bool Detalles_FacturasExists(int id)
        {
            return _context.Detalles_Facturas.Any(e => e.id_detalle_factura == id);
        }
    }
}