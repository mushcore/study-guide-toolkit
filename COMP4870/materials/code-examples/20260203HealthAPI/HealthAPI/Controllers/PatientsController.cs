using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HealthAPI.Models;
using HealthAPI.Data;
using Microsoft.AspNetCore.Cors;

[Route("api/[controller]")]
[ApiController]
[EnableCors("HealthPolicy")]
public class PatientsController : ControllerBase
{
    private readonly HealthContext _context;
    public PatientsController(HealthContext context)
    {
        _context = context;
    }

    // GET: api/Patient
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Patient>>> GetPatient()
    {
        return await _context.Patients!
            .Include(p => p.Ailments)
            .Include(p => p.Medications)
            .ToListAsync();
    }

    // GET: api/Patient/5
    [HttpGet("{id:int}")]
    public async Task<ActionResult<Patient>> GetPatient(int id)
    {
        var patient = await _context.Patients!
            .Include(i => i.Ailments)
            .Include(m => m.Medications)
            .FirstOrDefaultAsync(i => i.PatientId == id);


        if (patient == null)
        {
            return NotFound();
        }

        return patient;
    }

    // PUT: api/Patient/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{id:int}")]
    public async Task<IActionResult> PutPatient(int? id, Patient patient)
    {
        if (id != patient.PatientId)
        {
            return BadRequest();
        }

        _context.Entry(patient).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!PatientExists(id))
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

    // POST: api/Patient
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPost]
    public async Task<ActionResult<Patient>> PostPatient(Patient patient)
    {
        _context.Patients!.Add(patient);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetPatient", new { patientid = patient.PatientId }, patient);
    }

    // DELETE: api/Patient/5
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeletePatient(int? id)
    {
        var patient = await _context.Patients!.FindAsync(id);
        if (patient == null)
        {
            return NotFound();
        }

        _context.Patients!.Remove(patient);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool PatientExists(int? id)
    {
        return _context.Patients!.Any(e => e.PatientId == id);
    }

    // GET api/patients/3/medication
    [HttpGet("{id:int}/medication")]
    public async Task<IActionResult> GetMedications(int id)
    {
        var patient = await _context.Patients!
          .Include(m => m.Medications)
          .FirstOrDefaultAsync(i => i.PatientId == id);

        if (patient == null)
            return NotFound();

        return Ok(patient.Medications);
    }

}
