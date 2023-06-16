using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Panaderia.Data;
using Panaderia.Models;

namespace Panaderia.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StocksController : ControllerBase
    {
        private readonly StocksDbContext _context;

        public StocksController(StocksDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Stocks>>> GetStocks()
        {
            return await _context.Stocks.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Stocks>> GetStock(int id)
        {
            var stock = await _context.Stocks.FindAsync(id);

            if (stock == null)
            {
                return NotFound();
            }

            return stock;
        }

        [HttpPost]
        public async Task<ActionResult<Stocks>> CreateStock(Stocks stockDto)
        {
            _context.Stocks.Add(stockDto);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetStock), new { id = stockDto.id_stock }, stockDto);

        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStock(int id, Stocks stockDto)
        {
            if (id != stockDto.id_stock)
            {
                return BadRequest();
            }

            _context.Entry(stockDto).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StockExists(id))
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
        public async Task<IActionResult> DeleteStock(int id)
        {
            var stock = await _context.Stocks.FindAsync(id);

            if (stock == null)
            {
                return NotFound();
            }

            _context.Stocks.Remove(stock);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool StockExists(int id)
        {
            return _context.Stocks.Any(e => e.id_stock == id);
        }
    }
}