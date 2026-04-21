using System.Diagnostics;
using System.Text;
using System.Text.Json;
using SchoolBlazor.Models;
using SchoolLibrary;

namespace SchoolBlazor.Data;

public class StudentService
{
  HttpClient _client;
  JsonSerializerOptions _serializerOptions;
  public StudentService()
  {
    _client = new HttpClient();
    _serializerOptions = new JsonSerializerOptions
    {
      PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
      WriteIndented = true
    };
  }

  public async Task<Student?> GetStudentsByIdAsync(int id)
  {
    var stream = _client.GetStreamAsync($"{Constants.BASE_URL}/api/students/{id}");

    return await JsonSerializer.DeserializeAsync<Student>(await stream);
  }

  public async Task<Student[]?> GetStudentsAsync()
  {
    var stream = _client.GetStreamAsync($"{Constants.BASE_URL}/api/students");
    return await JsonSerializer.DeserializeAsync<Student[]>(await stream);
  }

  public async Task<ApiResponse> SaveStudentsAsync(Student item, bool isNewItem) {
    Uri uri; 
    bool isOk = false;
    string msg = string.Empty;

    try {
      string json = JsonSerializer.Serialize<Student>(item, _serializerOptions);
      StringContent content = new StringContent(json, Encoding.UTF8, "application/json");

      HttpResponseMessage? response = null;
      if (isNewItem) {
        uri = new Uri(string.Format($"{Constants.BASE_URL}/api/students", string.Empty));
        response = await _client.PostAsync(uri, content);
      } else {
        uri = new Uri(string.Format($"{Constants.BASE_URL}/api/students/{item.StudentId}", string.Empty));
        response = await _client.PutAsync(uri, content);
      }
      if (response.IsSuccessStatusCode) {
          isOk = true;
          if (isNewItem)
            msg = "Student successfully added.";
          else
            msg = "Student successfully updated.";

        Debug.WriteLine(@"\t{msg}");  
      } else {
          if (isNewItem)
            msg = "Failed to add student";
          else
            msg = "Failed to update student";

          Debug.WriteLine(@"\t{msg}");
      } 
    } catch (Exception ex) {
      msg = "ERROR: " + ex.Message;
      Debug.WriteLine(@"\t{msg}");
    }

    return new ApiResponse() {
      IsOk = isOk,
      Message = msg
    };
  }

  public async Task<ApiResponse> DeleteStudentItemAsync(int id) {
    Uri uri = new Uri(string.Format($"{Constants.BASE_URL}/api/students/{id}", id));
    bool isOk = false;
    string msg = string.Empty;

    try {
      HttpResponseMessage response = await _client.DeleteAsync(uri);
      if (response.IsSuccessStatusCode) {
          isOk = true;
          msg = "Student successfully deleted.";
          Debug.WriteLine(@"\t{msg}}");
      }
    } catch (Exception ex) {
      msg = "ERROR: " + ex.Message;
      Debug.WriteLine(@"\t{msg}");
    }

    return new ApiResponse() {
      IsOk = isOk,
      Message = msg
    };
  }
}

