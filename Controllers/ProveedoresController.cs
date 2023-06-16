using Panaderia.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Panaderia.Data;

namespace Panaderia.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProveedoresController : ControllerBase
    {
        private readonly ProveedorDbContext _context;

        public ProveedoresController(ProveedorDbContext context)
        {
            _context = context;
        }

        // GET: api/Proveedores
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Proveedores>>> GetProveedores()
        {
            return await _context.Proveedores.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Proveedores>> GetProveedor(int id)
        {
            var proveedor = await _context.Proveedores.FindAsync(id);

            if (proveedor == null)
            {
                return NotFound();
            }

            return proveedor;
        }

        [HttpPost]
        public async Task<ActionResult<Proveedores>> PostProveedor(Proveedores proveedor)
        {
            _context.Proveedores.Add(proveedor);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetProveedor", new { id = proveedor.id_proveedor }, proveedor);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutProveedor(int id, Proveedores proveedor)
        {
            if (id != proveedor.id_proveedor)
            {
                return BadRequest();
            }

            _context.Entry(proveedor).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProveedorExists(id))
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
        public async Task<IActionResult> DeleteProveedor(int id)
        {
            var proveedor = await _context.Proveedores.FindAsync(id);
            if (proveedor == null)
            {
                return NotFound();
            }

            _context.Proveedores.Remove(proveedor);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        //Buscar un proveedor por nombre
        [HttpGet("Buscar/{nombre}")]
        public async Task<ActionResult<IEnumerable<Proveedores>>> GetProveedores(string nombre)
        {
            var proveedores = await _context.Proveedores
                .Where(p => p.str_nombre_proveedor.Contains(nombre))
                .ToListAsync();

            if (proveedores == null)
            {
                return NotFound();
            }

            return proveedores;
        }

        //Buscar un proveedor por ruc
        [HttpGet("BuscarRuc/{ruc}")]
        public async Task<ActionResult<IEnumerable<Proveedores>>> GetProveedoresRuc(string ruc)
        {
            var proveedores = await _context.Proveedores
                .Where(p => p.str_ruc_proveedor.Contains(ruc))
                .ToListAsync();

            if (proveedores == null)
            {
                return NotFound();
            }

            return proveedores;
        }

        private bool ProveedorExists(int id)
        {
            return _context.Proveedores.Any(e => e.id_proveedor == id);
        }
    }
}
