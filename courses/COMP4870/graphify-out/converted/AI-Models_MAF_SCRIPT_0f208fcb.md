<!-- converted from AI-Models_MAF_SCRIPT.docx -->

AI Models
### Demo #1: Tokenization
Visit: https://platform.openai.com/tokenizer
Enter this text:
The vast majority of Egypt’s many hundreds of queens, although famed throughout their own land, were unknown in the outside world. As the dynastic age ended and the hieroglyphic script was lost, the queens’ stories were forgotten and their monuments buried under Egypt’s sands. But Cleopatra had lived in a highly literate age, and her actions had influenced the formation of the Roman Empire; her story could not be forgotten. Octavian (the future emperor Augustus) was determined that Roman history should be recorded in a way that confirmed his right to rule. To achieve this, he published his own autobiography and censored Rome’s official records. As Cleopatra had played a key role in his struggle to power, her story was preserved as an integral part of his. But it was diminished to just two episodes: her relationships with Julius Caesar and Mark Antony. Cleopatra, stripped of any political validity, was to be remembered as an immoral foreign woman who tempted upright Roman men. As such, she became a useful enemy for Octavian, who preferred to be remembered for fighting against foreigners rather than against his fellow Romans.
Output:

In the following exercises, we will be using AI Models on GitHub. Therefore, you will need to obtain a GitHub Personal Access Token.
### Demo #2 - Simple C# completion app with Microsoft Agent Framework (MAF)
View >> Command Palette... OR shift + command + p
dotnet new console -o MAFrecipe
cd MAFrecipe
dotnet add package Microsoft.Agents.AI.OpenAI --prerelease
dotnet add package Microsoft.Extensions.Configuration.Json
dotnet add package Azure.Identity
mkdir Plugins
mkdir Plugins/Baking
mkdir Plugins/Baking/CakeRecipe
type nul > Plugins/Baking/CakeRecipe/config.json
type nul > Plugins/Baking/CakeRecipe/skprompt.txt

Add this to Plugins/Baking/CakeRecipe/skprompt.txt
I want to bake a fabulous cake. Give me a recipe using the input provided. The cake must be easy, tasty, and cheap. I don't want to spend more than $10 on ingredients. I don't want to spend more than 30 minutes preparing the cake. I don't want to spend more than 30 minutes baking the cake.

[INPUT]
{{$input}}
[END INPUT]
Add this appsettings.json file:
{
"GitHub": {
"Token": "PUT-GITHUB-PERSONAL-ACCESS-TOKEN-HERE",
"ApiEndpoint": "https://models.github.ai/inference",
"Model": "openai/gpt-4o-mini"
}
}
NOTE: Since I cannot share the endpoint and keys, I have fake values for these settings.
Replace the code in Program.cs with the following code:
using Microsoft.Extensions.Configuration;
using OpenAI;
using OpenAI.Chat;
using Microsoft.Extensions.AI;
using Azure;

var config = new ConfigurationBuilder()
.SetBasePath(Directory.GetCurrentDirectory())
.AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
.Build();

string? apiKey = config["GitHub:Token"];
string? model = config["GitHub:Model"] ?? "openai/gpt-4o-mini";
string? endpoint = config["GitHub:ApiEndpoint"] ?? "https://models.github.ai/inference";

IChatClient chatClient = new ChatClient(
model,
new AzureKeyCredential(apiKey!),
new OpenAIClientOptions
{
Endpoint = new Uri(endpoint)
}
).AsIChatClient();

// Read the cake recipe prompt
var recipePromptPath = Path.Combine(Directory.GetCurrentDirectory(), "Plugins", "Baking", "CakeRecipe", "skprompt.txt");
var systemPrompt = await File.ReadAllTextAsync(recipePromptPath);

var agent = chatClient
.AsAIAgent(
instructions: systemPrompt, name: "CakeRecipeAgent"
);

// Request user for input
Console.ForegroundColor = ConsoleColor.DarkBlue;
Console.Write("Enter a cake type you want to bake: ");
var cakeType = Console.ReadLine() ?? "chocolate cake";

// Invoke the agent with the user input
var response = await agent.RunAsync(cakeType);

Console.ForegroundColor = ConsoleColor.Green;
Console.WriteLine(response);
Console.WriteLine();
Run the app with:
dotnet run
You will be asked to enter a type of cake. I entered: lemon.
Sample Output:
Here's a quick and easy Lemon Pound Cake recipe that fits your criteria perfectly!

### Easy Lemon Pound Cake

#### Ingredients:
- 1 cup granulated sugar (about $1)
- 1/2 cup unsalted butter, softened (about $1.50)
- 2 large eggs (about $0.50)
- 1 cup all-purpose flour (about $0.50)
- 1/4 cup milk (about $0.25)
- Zest of 1 large lemon (about $0.50)
- 2 tablespoons fresh lemon juice (about $0.25)
- 1/2 teaspoon baking powder (about $0.10)
- Pinch of salt (approximately $0.05)
- Optional: Powdered sugar for dusting (about $1)

#### Total Estimated Cost: Approximately $5.65

#### Instructions:

1. **Preheat Oven**: Preheat your oven to 350°F (175°C).

2. **Mix Ingredients**:
- In a large mixing bowl, cream together the softened butter and granulated sugar until light and fluffy.
- Beat in the eggs one at a time, mixing well after each addition.
- Add the lemon zest and lemon juice, mixing until combined.

3. **Combine Dry Ingredients**:
- In a separate bowl, mix the all-purpose flour, baking powder, and salt together.

4. **Combine Everything**:
- Gradually add the dry mixture into the wet ingredients, alternating with the milk. Stir until just combined (do not overmix).

5. **Prepare the Pan**:
- Grease a loaf pan or line it with parchment paper for easy removal.

6. **Bake**:
- Pour the batter into the prepared loaf pan and smooth the top. Bake in the preheated oven for about 25-30 minutes or until a toothpick inserted into the center comes out clean.

7. **Cool and Serve**:
- Allow the cake to cool in the pan for 10 minutes, then transfer to a wire rack to cool completely. Optionally, dust the top with powdered sugar before serving.

### Enjoy!
This delightful lemon pound cake is perfect for a quick treat and is sure to impress with its bright, zesty flavor!
### Demo #3 – Planner
dotnet new console -n PlannerWithMAF
cd PlannerWithMAF
dotnet add package Microsoft.Agents.AI.OpenAI --prerelease
dotnet add package Microsoft.Extensions.Configuration.Json
dotnet add package Azure.Identity
mkdir Plugins
cd Plugins
mkdir CityDetectionPlugin
cd CityDetectionPlugin
mkdir FindCity
cd FindCity
type nul > skprompt.txt
cd ..
cd ..
mkdir WriterPlugin
cd WriterPlugin
mkdir ShortPoem
cd ShortPoem
type nul > skprompt.txt
cd ..
cd ..
cd ..
Add this appsettings.json file:
{
"GitHub": {
"Token": "PUT-GITHUB-PERSONAL-ACCESS-TOKEN-HERE",
"ApiEndpoint": "https://models.github.ai/inference",
"Model": "openai/gpt-4o-mini"
},
"WeatherApiKey": "put your openweathermap.org key here"
}
Plugins
In Plugins/CityDetectionPlugin/FindCity:
skprompt.txt
## Instructions
Identify and reply with the name of a city from a given user input.
When you cannot identify a city name in the given input, reply with "Unknown".
Return the result in the specific json format, given below as Output Format.
Restrict your answers only to the Output json format given below.
No other commentary, reasoning, solutions, steps are needed.

## User Input Format:
{{$input}}

## Output Format:
{
"city": "CityName"
}
In Plugins/WriterPlugin/ShortPoem:
skprompt.txt
## Instructions
Write a short funny poem on type of clothes to wear depending upon the city and weather conditions.
Use the name of the city and weather condition details in the poem.
Name of the city is given under CityName input below.
A short note on weather conditions is given under WeatherInput below.
Write at least two stanzas.
Do not produce any other output, commentary, steps, or details.

## User Input Format:
{{$CityName}}
{{$WeatherInput}}
Native Plugins
In the Plugins folder add a class named CityInfo with the following content:
public class CityInfo {
public string? City { get; set; }

[Description("Get the City Name from the given JSON string")]
public static string GetCityNameFromJson([Description("The JSON string from which City Name needs to be extracted")] string jsonString) {
try {
if (!string.IsNullOrEmpty(jsonString)) {
CityInfo? cityInfo = JsonSerializer.Deserialize<CityInfo>(jsonString);
if (cityInfo != null && cityInfo.City != "Unknown") {
return cityInfo.City!;
} else {
return "Invalid or unknown city.";
}
} else {
return "Invalid or unknown city.";
}
} catch (JsonException) {
return "JSON parsing error";
}
}
}
Also, in the Plugins folder add a class named WeatherService with the following content:
public class WeatherService {
private static string _apiKey = "";
public WeatherService() {
var config = new ConfigurationBuilder()
.SetBasePath(Directory.GetCurrentDirectory())
.AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
.Build();
_apiKey = config["WeatherApiKey"]!;
}

[Description("Get the weather details of a location using city")]
public static async Task<string> GetWeatherAsync([Description("The city for which the weather report is needed")] string city) {
string baseUrl = "http://api.openweathermap.org/data/2.5/weather";
string requestUri = $"{baseUrl}?q={city}&appid={_apiKey}";

using (HttpClient client = new HttpClient()) {
HttpResponseMessage response = await client.GetAsync(requestUri);
if (response.IsSuccessStatusCode) {
string json = await response.Content.ReadAsStringAsync();
using JsonDocument doc = JsonDocument.Parse(json);
string description = doc.RootElement.GetProperty("weather")[0].GetProperty("description").GetString()!;
return $"Current weather in {city}: {description}";
} else {
return $"Error: Unable to retrieve weather data for {city}";
}
}
}
}
Replace Program.cs with this code:
using Azure;
using Microsoft.Agents.AI;
using Microsoft.Extensions.AI;
using Microsoft.Extensions.Configuration;
using OpenAI;
using OpenAI.Chat;
using PlannerWithMAF.Plugins;

var config = new ConfigurationBuilder()
.SetBasePath(Directory.GetCurrentDirectory())
.AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
.Build();

// Get configuration settings from appsettings.json
string token = config["GitHub:Token"]!;
string endpoint = config["GitHub:ApiEndpoint"]!;
string model = config["GitHub:Model"]!;

// Initialize WeatherService so the static API key is loaded
_ = new WeatherService();

IChatClient chatClient = new ChatClient(
model,
new AzureKeyCredential(token!),
new OpenAIClientOptions {
Endpoint = new Uri(endpoint)
}
).AsIChatClient();

// Create tools from the native plugin functions
AITool getCityNameTool = AIFunctionFactory.Create(
CityInfo.GetCityNameFromJson,
name: "GetCityNameFromJson",
description: "Get the City Name from the given JSON string");

AITool getWeatherTool = AIFunctionFactory.Create(
WeatherService.GetWeatherAsync,
name: "GetWeather",
description: "Get the weather details of a location using city name");

// Load the FindCity prompt template from skprompt.txt
string findCityTemplatePath = Path.Combine(Directory.GetCurrentDirectory(),
"Plugins", "CityDetectionPlugin", "FindCity", "skprompt.txt");
string findCityTemplate = File.ReadAllText(findCityTemplatePath);

AITool findCityTool = AIFunctionFactory.Create(
async (string input) => {
string prompt = findCityTemplate
.Replace("{{$input}}", input);
var result = await chatClient.GetResponseAsync(prompt);
return result.Text;
},
name: "FindCity",
description: "Find a city based on user input");


// Load the ShortPoem prompt template from skprompt.txt
string shortPoemTemplatePath = Path.Combine(Directory.GetCurrentDirectory(),
"Plugins", "WriterPlugin", "ShortPoem", "skprompt.txt");
string shortPoemTemplate = File.ReadAllText(shortPoemTemplatePath);

AITool writeShortPoemTool = AIFunctionFactory.Create(
async (string cityName, string weatherInput) => {
string prompt = shortPoemTemplate
.Replace("{{$CityName}}", cityName)
.Replace("{{$WeatherInput}}", weatherInput);
var result = await chatClient.GetResponseAsync(prompt);
return result.Text;
},
name: "WriteShortPoem",
description: "Write a short funny poem about clothes to wear based on city and weather conditions");

// Create the agent with tools and instructions
AIAgent agent = chatClient
.AsAIAgent(
name: "WeatherPoetAgent",
instructions: """
You are a helpful assistant that can detect cities from user input,
get weather information, and write short funny poems.

When a user mentions a city or asks about weather:
1. Identify the city name from the input. Format it as JSON like {"City": "CityName"}
and use the GetCityNameFromJson tool to extract and validate the city name.
2. Use the GetWeather tool to get the current weather for that city.
3. Use the WriteShortPoem tool with the city name and weather details to generate a poem.

Only output the poem result unless the user asks for something else.
""",
tools: [getCityNameTool, getWeatherTool, writeShortPoemTool, findCityTool]);

// Create a session to maintain conversation history
var session = await agent.CreateSessionAsync();

// Start chat loop
while (true) {
Console.ForegroundColor = ConsoleColor.DarkBlue;
Console.Write("User > ");
string? input = Console.ReadLine();

if (string.IsNullOrWhiteSpace(input)) continue;

Console.ForegroundColor = ConsoleColor.Green;
var response = await agent.RunAsync(input, session);
Console.WriteLine(response.Text);
}
Ask:
I will be in Seattle soon. I want a poem about the weather.
You get a good answer.
If you ask: “What time is it?”, it gets confused. The solution is to add another native function that delivers information about current time.
Add this plugin class in the Plugins folder:
public class TimePlugin {
[Description("Retrieves the current time in UTC.")]
public static string GetCurrentUtcTime() => DateTime.UtcNow.ToString("R");
}
Declare the plugin in Program.cs with:
AITool getCurrentTimeTool = AIFunctionFactory.Create(
TimePlugin.GetCurrentUtcTime,
name: "GetCurrentUtcTime",
description: "Get the current UTC time");
Then, add getCurrentTimeTool to the tools array.
Ask again and you will get a good answer.
### Demo #4 - Using Microsoft Agentic Framework with AI models hosted on GitHub
https://blog.medhat.ca/2026/01/using-microsoft-agent-framework-with-ai.html
### Demo #5 - Function Calling with Microsoft Agent Framework, C#, & Entity Framework
https://blog.medhat.ca/2026/03/function-calling-with-microsoft-agent.html
