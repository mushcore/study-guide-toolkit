using System.Net;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using StudentFunctions.Models.School;
using Microsoft.EntityFrameworkCore;

namespace Comp.Function;

public class HttpWebApi(ILogger<HttpWebApi> _logger, SchoolContext _context)
{
    [Function("HttpWebApi")]
    public IActionResult Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post")] HttpRequest req)
    {
        _logger.LogInformation("C# HTTP trigger function processed a request.");
        return new OkObjectResult("Welcome to Azure Functions!");
    }

    [Function("GetStudents")]
    public async Task<HttpResponseData> GetStudents(
    [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "students")] HttpRequestData req)
    {
        _logger.LogInformation("C# HTTP GET/posts trigger function processed a request in GetStudents().");

        var students = await _context.Students.ToArrayAsync();

        var response = req.CreateResponse(HttpStatusCode.OK);
        response.Headers.Add("Content-Type", "application/json");

        await response.WriteStringAsync(JsonConvert.SerializeObject(students));

        return response;
    }

    [Function("GetStudentById")]
    public async Task<HttpResponseData> GetStudentById
    (
      [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "students/{id}")] HttpRequestData req,
      int id
    )
    {
        _logger.LogInformation("C# HTTP GET/posts trigger function processed a request.");
        var student = await _context.Students.FindAsync(id);
        if (student == null)
        {
            var response = req.CreateResponse(HttpStatusCode.NotFound);
            response.Headers.Add("Content-Type", "application/json");
            await response.WriteStringAsync("Not Found");
            return response;
        }
        var response2 = req.CreateResponse(HttpStatusCode.OK);
        response2.Headers.Add("Content-Type", "application/json");
        await response2.WriteStringAsync(JsonConvert.SerializeObject(student));
        return response2;
    }

    [Function("CreateStudent")]
    public async Task<HttpResponseData> CreateStudent
    (
      [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "students")] HttpRequestData req
    )
    {
        _logger.LogInformation("C# HTTP POST/posts trigger function processed a request.");
        var student = JsonConvert.DeserializeObject<Student>(req.ReadAsStringAsync().Result!);
        _context.Students.Add(student!);
        await _context.SaveChangesAsync();
        var response = req.CreateResponse(HttpStatusCode.Created);
        response.Headers.Add("Content-Type", "application/json");
        await response.WriteStringAsync(JsonConvert.SerializeObject(student));
        return response;
    }

    [Function("UpdateStudent")]
    public async Task<HttpResponseData> UpdateStudent
    (
      [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "students/{id}")] HttpRequestData req,
      int id
    )
    {
        _logger.LogInformation("C# HTTP PUT/posts trigger function processed a request.");
        var student = await _context.Students.FindAsync(id);
        if (student == null)
        {
            var response = req.CreateResponse(HttpStatusCode.NotFound);
            response.Headers.Add("Content-Type", "application/json");
            await response.WriteStringAsync("Not Found");
            return response;
        }
        var student2 = JsonConvert.DeserializeObject<Student>(req.ReadAsStringAsync().Result!);
        student.FirstName = student2!.FirstName;
        student.LastName = student2.LastName;
        student.School = student2.School;
        await _context.SaveChangesAsync();
        var response2 = req.CreateResponse(HttpStatusCode.OK);
        response2.Headers.Add("Content-Type", "application/json");
        await response2.WriteStringAsync(JsonConvert.SerializeObject(student));
        return response2;
    }
    [Function("DeleteStudent")]
    public async Task<HttpResponseData> DeleteStudent
    (
    [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "students/{id}")] HttpRequestData req,
    int id
    )
    {
        _logger.LogInformation("C# HTTP DELETE/posts trigger function processed a request.");
        var student = await _context.Students.FindAsync(id);
        if (student == null)
        {
            var response = req.CreateResponse(HttpStatusCode.NotFound);
            response.Headers.Add("Content-Type", "application/json");
            await response.WriteStringAsync("Not Found");
            return response;
        }
        _context.Students.Remove(student);
        await _context.SaveChangesAsync();
        var response2 = req.CreateResponse(HttpStatusCode.OK);
        response2.Headers.Add("Content-Type", "application/json");
        await response2.WriteStringAsync(JsonConvert.SerializeObject(student));
        return response2;
    }

}