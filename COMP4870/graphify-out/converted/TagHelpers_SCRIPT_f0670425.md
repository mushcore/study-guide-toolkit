<!-- converted from TagHelpers_SCRIPT.docx -->

Tag Helpers
# Use .NET 10
Tag Helpers in ASP.NET Core allow you to create your own tags that fulfill a server-side purpose. In this tutorial, we will create a tag helper <toon> that accesses a Web API service and displays content in any razor view page.

The Web API service we will consume in this exercise is located at https://apipool.azurewebsites.net/api/toons. It delivers the names of cartoon characters and their respective images.

1) To start with, create an ASP.NET Core Web application named ToonTagHelper in Visual Studio 2019.
dotnet new razor -o ToonTagDemo
2) We need to create a class that closely matches the nature of the Web API JSON object. Therefore, add the following Toon class to a Models folder in your project:
public class Toon {
[JsonPropertyName("lastName")]
public string? LastName { get; set; }

[JsonPropertyName("firstName")]
public string? FirstName { get; set; }

[JsonPropertyName("pictureUrl")]
public string? PictureUrl { get; set; }
}
3) Add the following tag to the bottom of Pages/Index.cshtml:
<div>
<toon></toon>
</div>
4) Create a folder named TagHelpers and add to it a class file named ToonTag.cs. Have the class inherit from TagHelper and override the ProcessAsync() method as follows:

public async override Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
{
}

We could have implemented a method Process() instead. However, in our case, it is appropriate to implement ProcessAsync() instead because we are about to make an async call to a remote service.

5) Add the following instance variable to the ToonTag class:
private string baseUrl = "https://apipool.azurewebsites.net";
6) Annotate the ToonTag class with the following:
[HtmlTargetElement("toon")]
[HtmlTargetElement(Attributes = "toonie")]
The first annotation defines the tag <toon> and the second defines the “toon” attribute. This means that we have two different ways to produce the same output on a razor .cshtml view.

7) Add the following method to the ToonTagHelper class:
async Task<IEnumerable<Toon>>? GetToonsAsync() {
HttpClient client = new HttpClient();
client.BaseAddress = new Uri(baseUrl);
client.DefaultRequestHeaders.Accept.Clear();
client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
IEnumerable<Toon>? toons = null;
try {
// Get all cartoon characters
HttpResponseMessage response = await client.GetAsync("/api/toons");

if (response.IsSuccessStatusCode) {
string json = await response.Content.ReadAsStringAsync();
toons = JsonSerializer.Deserialize<IEnumerable<Toon>>(json) ?? Array.Empty<Toon>();
}
} catch (Exception e) {
System.Diagnostics.Debug.WriteLine(e.ToString());
}

return toons!;
}
The above code makes a request to the Web API service and returns an IEnumerable<Toon> collection with the results.

8) Add the following code inside the ProcessAsync() method:
IEnumerable<Toon> toons = await GetToonsAsync()!;
if (toons == null) {
output.Content.SetHtmlContent("<h3 class='text-danger'>No data found<h3>");
return;
}

string html = string.Empty;
html += $"<table>";
html += "<tr><th>Name</th><th>Picture</th></tr>";

foreach (var item in toons) {
html += "<tr>";
html += $"<td>{item.FirstName} {item.LastName}</td>";
html += "<td><img src='" + item.PictureUrl + "' style='width: 50px' /></td>";
html += "</tr>";
}
html += "</table>";
output.Content.SetHtmlContent(html);
The above code creates a table with the collection of cartoon characters so that it can be displayed wherever the tag helper is used.

9) Register the tag name in the Views/_ViewImports.cshtml file by adding the following to the list of tags that are already there:

    @addTagHelper "ToonTagDemo.TagHelpers.ToonTag, ToonTagDemo"

You may need to adjust the above names depending on what you called your app and/or your tag helper class.

10) Compile and run your application. You should see the following output:


If you inspect the table in your browser, you will see the following:

The above is using the tag and not the attribute. Edit Index.cshtml and comment out “<toon></toon>” and put the following <div> tag with the toon attribute underneath it:
<div toonie></div>
Your Index.cshtml should now look like this:
@*<toon></toon>*@
<div toonie></div>
When you run your application. you should see the same output as before. However, upon inspection of the HTML source, you will notice that a <div> tag is the primary container for our code rather than a <toon> tag:

# Passing parameters into tag helper
Suppose we want to pass font-family, font-size, and foreground-color parameters from the tag into the tag helper like this:
<toon
font-family="arial"
font-size="larger"
foreground-color="purple">
</toon>
### Steps:
- Add public instance variables to ToonTag as shown below:
public string? FontFamily { get; set; }
public string? FontSize { get; set; }
public string? ForegroundColor { get; set; }
- Add this code right before “string html = string.Empty;” inside ProcessAsync() method:
string customStyle = string.Empty;
customStyle += $"font-family: {FontFamily};";
customStyle += $"font-size: {FontSize};";
customStyle += $"color: {ForegroundColor};";

output.Attributes.SetAttribute("style", customStyle);
- Update <toon> tag in Views/Index.cshtml to:
<toon
font-family="arial"
font-size="larger"
foreground-color="purple">
</toon>
