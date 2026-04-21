using System;
using System.Net.Http.Headers;
using System.Text.Json;
using Microsoft.AspNetCore.Razor.TagHelpers;
using ToonTagDemo.Models;

namespace ToonTagDemo.TagHelpers;

[HtmlTargetElement("toon")]
[HtmlTargetElement(Attributes = "toonie")]
public class ToonTag: TagHelper
{
    private string baseUrl = "https://apipool.azurewebsites.net";
    public string? FontFamily { get; set; }
    public string? FontSize { get; set; }
    public string? ForegroundColor { get; set; }

    public async override Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        IEnumerable<Toon> toons = await GetToonsAsync()!;
        if (toons == null)
        {
            output.Content.SetHtmlContent("<h3 class='text-danger'>No data found<h3>");
            return;
        }
        string customStyle = string.Empty;
        customStyle += $"font-family: {FontFamily};";
        customStyle += $"font-size: {FontSize};";
        customStyle += $"color: {ForegroundColor};";

        output.Attributes.SetAttribute("style", customStyle);


        string html = string.Empty;
        html += $"<table>";
        html += "<tr><th>Name</th><th>Picture</th></tr>";

        foreach (var item in toons)
        {
            html += "<tr>";
            html += $"<td>{item.FirstName} {item.LastName}</td>";
            html += "<td><img src='" + item.PictureUrl + "' style='width: 50px' /></td>";
            html += "</tr>";
        }
        html += "</table>";
        output.Content.SetHtmlContent(html);
    }

    async Task<IEnumerable<Toon>>? GetToonsAsync()
    {
        HttpClient client = new HttpClient();
        client.BaseAddress = new Uri(baseUrl);
        client.DefaultRequestHeaders.Accept.Clear();
        client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        IEnumerable<Toon>? toons = null;
        try
        {
            // Get all cartoon characters
            HttpResponseMessage response = await client.GetAsync("/api/toons");

            if (response.IsSuccessStatusCode)
            {
                string json = await response.Content.ReadAsStringAsync();
                toons = JsonSerializer.Deserialize<IEnumerable<Toon>>(json) ?? Array.Empty<Toon>();
            }
        }
        catch (Exception e)
        {
            System.Diagnostics.Debug.WriteLine(e.ToString());
        }

        return toons!;
    }

}
