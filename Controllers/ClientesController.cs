using Panaderia.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Panaderia.Data;

namespace Panaderia.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class ClientesController : ControllerBase
    {
        private readonly FacturasDbContext _context;

        public ClientesController(FacturasDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Clientes>>> GetClientes()
        {
            return await _context.Clientes.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Clientes>> GetClientes(int id)
        {
            var clientes = await _context.Clientes.FindAsync(id);

            if (clientes == null)
            {
                return NotFound();
            }

            return clientes;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutClientes(int id, Clientes clientes)
        {
            if (id != clientes.id_cliente)
            {
                return BadRequest();
            }

            _context.Entry(clientes).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClientesExists(id))
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
        public async Task<ActionResult<Clientes>> PostClientes(Clientes clientes)
        {
            _context.Clientes.Add(clientes);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetClientes", new { id = clientes.id_cliente }, clientes);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Clientes>> DeleteClientes(int id)
        {
            var clientes = await _context.Clientes.FindAsync(id);
            if (clientes == null)
            {
                return NotFound();
            }

            _context.Clientes.Remove(clientes);
            await _context.SaveChangesAsync();

            return clientes;
        }

        //Buscar un producto elaborado por nombre
        [HttpGet("Buscar/{nombre}")]
        public async Task<ActionResult<IEnumerable<Clientes>>> GetClientes(string nombre)
        {
            var clientes = await _context.Clientes
                .Where(p => p.str_nombre_cliente.Contains(nombre))
                .ToListAsync();

            if (clientes == null)
            {
                return NotFound();
            }

            return clientes;
        }

        private bool ClientesExists(int id)
        {
            return _context.Clientes.Any(e => e.id_cliente == id);
        }

    }
}