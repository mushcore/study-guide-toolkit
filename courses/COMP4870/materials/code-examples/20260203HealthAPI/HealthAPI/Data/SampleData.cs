using System;
using HealthAPI.Models;

namespace HealthAPI.Data;

public class SampleData
{
    public static List<Patient> GetPatients()
    {
        List<Patient> patients = new List<Patient>() {
            new Patient() {
                PatientId = 1,
                Name="Jim Jones",
            },
            new Patient() {
                PatientId = 2,
                Name="Ann Smith",
            },
            new Patient() {
                PatientId = 3,
                Name="Tom Myers",
            },
        };

        return patients;
    }

    public static List<Medication> GetMedication()
    {
        List<Medication> medication = new List<Medication>() {
            new Medication() {
                Name="Tylenol",
                Doses = "2 tablets per day",
                PatientId = 1
            },
            new Medication() {
                Name="Aspirin",
                Doses = "3 tablets per day",
                PatientId = 1
            },
            new Medication() {
                Name="Advil",
                Doses = "1 tablet per day",
                PatientId = 2
            },
            new Medication() {
                Name="Robaxin",
                Doses = "2 teaspoons per day",
                PatientId = 3
            },
            new Medication() {
                Name="Voltarin",
                Doses = "apply cream twice per day",
                PatientId = 2
            },
        };

        return medication;
    }

    public static List<Ailment> GetAilments()
    {
        List<Ailment> ailments = new List<Ailment>() {
            new Ailment() {
                Name="Headache",
                PatientId = 1
            },
            new Ailment() {
                Name="Tummy pain",
                PatientId = 1
            },
            new Ailment() {
                Name="Flu",
                PatientId = 2
            },
            new Ailment() {
                Name="Bone fracture",
                PatientId = 3
            },
            new Ailment() {
                Name="Covid",
                PatientId = 2
            },
        };

        return ailments;
    }

}

