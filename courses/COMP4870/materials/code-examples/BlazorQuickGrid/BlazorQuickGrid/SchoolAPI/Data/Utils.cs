using CsvHelper;
using CsvHelper.Configuration;
using SchoolLibrary;
using System.Globalization;

namespace SchoolAPI.Data;

public class Utils
{
    public static IEnumerable<Student> GetDataFromCsvFile(string csvFilePath)
    {
        var config = new CsvConfiguration(CultureInfo.InvariantCulture)
        {
            PrepareHeaderForMatch = args => args.Header.ToLower(),
        };

        var records = new List<Student>().AsEnumerable();
        using (var reader = new StreamReader(csvFilePath))
        {
            using (var csv = new CsvReader(reader, config))
            {
                records = (csv.GetRecords<Student>()).ToList();
            }
        }

        return records;
    }
}
