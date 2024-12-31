using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyList.Web.Models;
using MyListServer.Data;

namespace MyList.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TvSeriesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TvSeriesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/tvseries
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TvSeries>>> GetTvSeries()
        {
            return await _context.TvSeries.ToListAsync();
        }

        // GET: api/tvseries/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TvSeries>> GetTvSeries(int id)
        {
            var tvSeries = await _context.TvSeries.FindAsync(id);

            if (tvSeries == null)
            {
                return NotFound();
            }

            return tvSeries;
        }

        // POST: api/tvseries
        [HttpPost]
        public async Task<ActionResult<TvSeries>> PostTvSeries(TvSeries tvSeries)
        {
            _context.TvSeries.Add(tvSeries);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTvSeries", new { id = tvSeries.Id }, tvSeries);
        }

        // PUT: api/tvseries/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTvSeries(int id, TvSeries tvSeries)
        {
            if (id != tvSeries.Id)
            {
                return BadRequest();
            }

            _context.Entry(tvSeries).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TvSeriesExists(id))
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

        // DELETE: api/tvseries/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTvSeries(int id)
        {
            var tvSeries = await _context.TvSeries.FindAsync(id);
            if (tvSeries == null)
            {
                return NotFound();
            }

            _context.TvSeries.Remove(tvSeries);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TvSeriesExists(int id)
        {
            return _context.TvSeries.Any(e => e.Id == id);
        }
    }
}
