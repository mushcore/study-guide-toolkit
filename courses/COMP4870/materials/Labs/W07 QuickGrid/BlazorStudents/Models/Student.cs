using System;
using System.ComponentModel.DataAnnotations;

namespace BlazorStudents.Models;

public class Student
{
    public int StudentId { get; set; }

    [Required(ErrorMessage = "You must enter first name.")]
    public string? FirstName { get; set; }

    [Required(ErrorMessage = "You must enter last name.")]
    public string? LastName { get; set; }

    [Required(ErrorMessage = "You must enter school.")]
    public string? School { get; set; }


    [Required(ErrorMessage = "You must enter gender.")]
    public string? Gender { get; set; }

    [Required(ErrorMessage = "You must enter date of birth.")]
    public DateTime? DateOfBirth { get; set; }
}

