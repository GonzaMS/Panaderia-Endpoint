using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Panaderia.Data;
using Panaderia.Models;

namespace Panaderia.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Ordenes_ProduccionController : ControllerBase
    {
        private readonly OrdenesDbContext _context;

        public Ordenes_ProduccionController(OrdenesDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Ordenes_produccion>>> GetOrdenes_Produccion()
        {
            return await _context.Ordenes_Produccion.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Ordenes_produccion>> GetOrdenes_produccion(int id)
        {
            var ordenes_produccion = await _context.Ordenes_Produccion.FindAsync(id);

            if (ordenes_produccion == null)
            {
                return NotFound();
            }

            return ordenes_produccion;
        }

        [HttpPost]
        public async Task<ActionResult<Ordenes_produccion>> PostOrdenes_produccion(Ordenes_produccion ordenes_produccion)
        {
            _context.Ordenes_Produccion.Add(ordenes_produccion);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetOrdenes_produccion", new { id = ordenes_produccion.id_orden }, ordenes_produccion);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutOrdenes_produccion(int id, Ordenes_produccion ordenes_produccion)
        {
            if (id != ordenes_produccion.id_orden)
            {
                return BadRequest();
            }

            var ord = await _context.Ordenes_Produccion.FindAsync(id);
            if (ord == null)
            {
                return NotFound();
            }

            ord.bool_estado_orden = ordenes_produccion.bool_estado_orden;
            _context.Entry(ord).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!Ordenes_produccionExists(id))
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
        public async Task<IActionResult> DeleteOrdenes_produccion(int id)
        {
            var ordenes_produccion = await _context.Ordenes_Produccion.FindAsync(id);
            if (ordenes_produccion == null)
            {
                return NotFound();
            }

            _context.Ordenes_Produccion.Remove(ordenes_produccion);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool Ordenes_produccionExists(int id)
        {
            return _context.Ordenes_Produccion.Any(e => e.id_orden == id);
        }

    }
}