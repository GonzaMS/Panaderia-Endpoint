using Panaderia.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Panaderia.Data;

namespace Panaderia.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IngredientesController : ControllerBase
    {
        private readonly IngredientesDbContext _context;

        public IngredientesController(IngredientesDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Ingredientes>>> GetIngredientes()
        {
            return await _context.Ingredientes.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Ingredientes>> GetIngredientes(int id)
        {
            var ingredientes = await _context.Ingredientes.FindAsync(id);

            if (ingredientes == null)
            {
                return NotFound();
            }

            return ingredientes;
        }

        [HttpPost]
        public async Task<ActionResult<Ingredientes>> PostIngredientes(Ingredientes ingredientes)
        {
            _context.Ingredientes.Add(ingredientes);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetIngredientes", new { id = ingredientes.id_ingrediente }, ingredientes);
        }

        [HttpPut("{id}")]

        public async Task<IActionResult> PutIngredientes(int id, Ingredientes ingredientes)
        {
            if (id != ingredientes.id_ingrediente)
            {
                return BadRequest();
            }

            _context.Entry(ingredientes).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!IngredientesExists(id))
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
        public async Task<ActionResult<Ingredientes>> DeleteIngredientes(int id)
        {
            var ingredientes = await _context.Ingredientes.FindAsync(id);
            if (ingredientes == null)
            {
                return NotFound();
            }

            _context.Ingredientes.Remove(ingredientes);
            await _context.SaveChangesAsync();

            return ingredientes;
        }

        private bool IngredientesExists(int id)
        {
            return _context.Ingredientes.Any(e => e.id_ingrediente == id);
        }
    }
}