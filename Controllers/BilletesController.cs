using Panaderia.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Panaderia.Data;

namespace Panaderia.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class BilletesController : ControllerBase
    {
        private readonly ArqueosDbContext _context;

        public BilletesController(ArqueosDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Billetes>>> GetBilletes()
        {
            return await _context.Billetes.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Billetes>> GetBilletes(int id)
        {
            var billetes = await _context.Billetes.FindAsync(id);

            if (billetes == null)
            {
                return NotFound();
            }

            return billetes;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutBilletes(int id, Billetes billetes)
        {
            if (id != billetes.id_billete)
            {
                return BadRequest();
            }

            _context.Entry(billetes).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BilletesExists(id))
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
        public async Task<ActionResult<Billetes>> PostBilletes(Billetes billetes)
        {
            _context.Billetes.Add(billetes);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetBilletes", new { id = billetes.id_billete }, billetes);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Billetes>> DeleteBilletes(int id)
        {
            var billtes = await _context.Billetes.FindAsync(id);
            if (billtes == null)
            {
                return NotFound();
            }

            _context.Billetes.Remove(billtes);
            await _context.SaveChangesAsync();

            return billtes;
        }

        private bool BilletesExists(int id)
        {
            return _context.Billetes.Any(e => e.id_billete == id);
        }

    }
}