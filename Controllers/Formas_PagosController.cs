using Panaderia.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Panaderia.Data;

namespace Panaderia.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Formas_PagosController : ControllerBase
    {
        private readonly CobrosDbContext _context;

        public Formas_PagosController(CobrosDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Formas_pagos>>> GetFormas_Pagos()
        {
            return await _context.Formas_Pagos.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Formas_pagos>> GetFormas_Pagos(int id)
        {
            var formas_pagos = await _context.Formas_Pagos.FindAsync(id);

            if (formas_pagos == null)
            {
                return NotFound();
            }

            return formas_pagos;
        }

        [HttpPost]
        public async Task<ActionResult<Formas_pagos>> PostFormas_Pagos(Formas_pagos formas_pagos)
        {
            _context.Formas_Pagos.Add(formas_pagos);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetFormas_Pagos", new { id = formas_pagos.id_forma_pago }, formas_pagos);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutFormas_pagos(int id, Formas_pagos formas_pagos)
        {
            if (id != formas_pagos.id_forma_pago)
            {
                return BadRequest();
            }

            _context.Entry(formas_pagos).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!Formas_PagosExists(id))
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
        public async Task<ActionResult<Formas_pagos>> DeleteFormas_Pagos(int id)
        {
            var formas_pagos = await _context.Formas_Pagos.FindAsync(id);
            if (formas_pagos == null)
            {
                return NotFound();
            }

            _context.Formas_Pagos.Remove(formas_pagos);
            await _context.SaveChangesAsync();

            return formas_pagos;
        }

        private bool Formas_PagosExists(int id)
        {
            return _context.Formas_Pagos.Any(e => e.id_forma_pago == id);
        }
    }
}