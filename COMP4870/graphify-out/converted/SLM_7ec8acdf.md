<!-- converted from SLM.docx -->

# Ollama
## Demo #1 - C# client for Phi-3 SLM
Download Ollama installer from https://www.ollama.com/download.
In a terminal window, run this command:
ollama pull phi3:latest
ollama list		OR		ollama ls
ollama show phi3:latest
### OllamaSharp SDK
In a working directory, create a C# console app from inside a terminal window with the following command:
dotnet new console -n SLM.OllamaClient
cd SLM.OllamaClient
dotnet add package OllamaSharp
Replace Program.cs with the following code:
using Microsoft.Extensions.AI;
using OllamaSharp;

IChatClient chatClient =
new OllamaApiClient(new Uri("http://localhost:11434/"), "phi3");

// Start the conversation with context for the AI model
List<ChatMessage> chatHistory = new();

while (true) {
// Get user prompt and add to chat history
Console.WriteLine("Your prompt:");
var userPrompt = Console.ReadLine();
chatHistory.Add(new ChatMessage(ChatRole.User, userPrompt));

// Stream the AI response and add to chat history
Console.WriteLine("AI Response:");
var response = "";
await foreach (ChatResponseUpdate item in
chatClient.GetStreamingResponseAsync(chatHistory))
{
Console.Write(item.Text);
response += item.Text;
}
chatHistory.Add(new ChatMessage(ChatRole.Assistant, response));
Console.WriteLine();
}
### Microsoft Agent Framework (MSF) SDK
In a working directory, create a C# console app from inside a terminal window with the following command:
dotnet new console -n MAF.Slm
cd MAF.Slm
dotnet add package Microsoft.Agents.AI --prerelease
dotnet add package Microsoft.Extensions.AI -v 10.4.0
dotnet add package OllamaSharp
Replace Program.cs with the following code:
using Microsoft.Agents.AI;
using Microsoft.Extensions.AI;
using OllamaSharp;

string ollamaUrl = "http://localhost:11434/";
string modelId = "llava:7b";
IChatClient ollamaClient = new OllamaApiClient(ollamaUrl, modelId);

ChatClientAgent agent = new ChatClientAgent(
ollamaClient,
new ChatClientAgentOptions
{
Name = "Astronomer",
ChatOptions = new ChatOptions
{
Instructions = @"You are an astronomer who specializes in the solar system.
You have a deep understanding of the planets, moons, and other celestial bodies that make up our solar system.
You can answer questions about the solar system, provide detailed descriptions of the planets and their characteristics, and explain complex astronomical concepts in a way that is easy to understand.
You are also able to analyze images of celestial bodies and provide insights based on your expertise.",
Temperature = 0.7f
}
}
);

Console.WriteLine(
await agent.RunAsync("How far is earth from the sun?")
);
Run the application any you will receive a response like the following:
The average distance between Earth and the Sun, known as an Astronomical Unit (AU), which represents our planet's mean orbital radius or its semi-major axis length around the Sun, is about 93 million miles. To express this in kilometers, we multiply by a conversion factor of approximately 1.496 x 1 endorsing to get roughly 150 million km (or precisely speaking, it's exactly 149.6 million kilometers). Hence the Earth is around 1 AU or 150 million kilometers away from the Sun on average in its elliptical orbit.
The above response is not streamed and appears all at once. To stream the response, comment out the “Console.WriteLine()” statement and replace it with the following:
await foreach (var response in agent.RunStreamingAsync("Which planet is closest to the sun?")) {
Console.Write(response);
}
We can get our application to describe an image. In the following example we ask the SLM to tell us more about an image of one of the planets in our solar system. Use the llava:7b model. Comment out the above code and replace it with the following:
DataContent img = new(File.ReadAllBytes(@"./planet.jpg"), "image/jpg");
ChatMessage msg = new(ChatRole.User, [new TextContent("Describe the image?"), img]);
Console.WriteLine(await agent.RunAsync(msg));
## Demo #2: AI Toolkit Extension in VS Code
Install this VS Code extension:

Click on … >> AI Toolkit.

Click on “Discover >> Model Catalog”.

Scroll down until you “Local Models” >> “Foundry Local”, then click on the “Show More” button.

Add “Phi-4-generic-gpu:1 (8570 MB)”.

The model is downloaded and placed under your {home}/.aitk/models folder:

Click on “Try In Playground”.

- Select the model
- Add a system prompt: You specialize in the solar system
- Set “Temperature” to 0
- Set “Top P” to 0
- Set “Max Response Tokens” to 256
- Submit prompt: What is the furthest planet to the sun?

The AI responds with something like this:
As of the current understanding and classification of planets in our solar system, Neptune is the furthest planet from the Sun. It is the eighth planet in the solar system, orbiting at an average distance of about 30.1 astronomical units (AU) from the Sun. However, it's worth noting that Pluto, which was reclassified as a "dwarf planet" by the International Astronomical Union (IAU) in 2006, orbits at a greater average distance of about 39.5 AU from the Sun. Despite this, Neptune is still considered the eighth and furthest planet due to its status as a "classical" planet.

### OpenAI SDK
Click on “</> View Code” button.

Choose “OpenAI SDK”.

Choose C#.

Code for a “file-based C# app” is displayed in VS Code which looks like this:
/**
* Run this model in .NET 10
* > dotnet run <this-script-path>.cs
*/

#:package OpenAI@*-*
using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading.Tasks;
using OpenAI;
using OpenAI.Chat;

var credential = new System.ClientModel.ApiKeyCredential("unused"); // required for the API but not used
var openAIClient = new OpenAIClient(credential, new OpenAIClientOptions
{
Endpoint = new Uri("http://localhost:5272/v1/")
});
var client = openAIClient.GetChatClient("Phi-4-generic-gpu:1");

var messages = new List<ChatMessage> {
ChatMessage.CreateSystemMessage("You specialize in the solar system"),
ChatMessage.CreateUserMessage(
"INSERT_INPUT_HERE"
),
};

var options = new ChatCompletionOptions();

options.MaxOutputTokenCount = 256;

var completion = await client.CompleteChatAsync(messages, options);
Console.WriteLine($"[Model Response] {completion.Value.Content[0].Text}");
Save the C# code into a text file named Phi3SolarSystemExpert.cs. Replace "INSERT_INPUT_HERE" with a prompt like:
What is the biggest planet in our solar system?
Then run the app in a terminal window with command:
dotnet run Phi3SolarSystemExpert.cs
The output will be like this:
[Model Response] The biggest planet in our solar system is Jupiter. It is the largest planet both in terms of diameter and mass. Jupiter has a diameter of about 142,984 kilometers (88,846 miles) and is more than twice as massive as all the other planets in the solar system combined. Its massive size and strong gravitational pull have a significant influence on the solar system, including the orbits of other planets and numerous moons. Jupiter is a gas giant, primarily composed of hydrogen and helium, and is known for its prominent Great Red Spot, a giant storm that has been raging for at least 400 years.
### Microsoft Agent FrameworkSDK
Create another text file named Phi3SolarSystemExpertMAF.cs and add to it this “File-based C# app” code.
/**
* Microsoft Agent Framework - Solar System Expert Agent
* Run this in .NET 10
* > dotnet run <this-script-path>.cs
*/

#:package Microsoft.Agents.AI.OpenAI@*-*

using System.ClientModel;
using OpenAI;
using OpenAI.Chat;
using Microsoft.Agents.AI;
using Microsoft.Extensions.AI;


const string AgentName = "SolarSystemExpert";
const string AgentInstructions = "You are an expert specialist in the solar system. Provide accurate, detailed, and engaging information about planets, moons, asteroids, and other celestial bodies. Your knowledge covers astronomy, planetary science, orbital mechanics, and space exploration.";
const string LocalModelEndpoint = "http://localhost:5272/v1/";
const string ModelDeploymentName = "Phi-4-generic-gpu:1";

try {
// Create OpenAI client for local model endpoint
var credential = new ApiKeyCredential("unused"); // Required but not used for local models
var openAIClient = new OpenAIClient(credential, new OpenAIClientOptions {
Endpoint = new Uri(LocalModelEndpoint)
});

var chatClient = openAIClient.GetChatClient(ModelDeploymentName);

// Create AI Agent with streaming for production-grade performance
AIAgent agent = chatClient
.AsAIAgent(
name: AgentName,
instructions: AgentInstructions
);

// Question about the solar system
string userQuery = "What is the closest planet to earth?";

Console.WriteLine($"\n[User] {userQuery}\n");
Console.Write("[Agent] ");

var chatOptions = new ChatOptions {
Temperature = 0.7f,
MaxOutputTokens = 500,
};

await foreach (var update in agent.RunStreamingAsync(userQuery,
options: new ChatClientAgentRunOptions(chatOptions)))
{
if (!string.IsNullOrEmpty(update.Text)) {
Console.Write(update.Text);
}
}

Console.WriteLine("\n");
} catch (Exception ex) {
Console.Error.WriteLine($"Error: {ex.Message}");
Environment.Exit(1);
}
Open the AI Toolkit in Visual Studio Code, then run the following command from a terminal window:
dotnet run Phi3SolarSystemExpertMAF.cs
The output will look like this:
[Agent] The closest planet to Earth can vary over time due to the elliptical orbits of the planets in our solar system. Generally, Venus is the closest planet to Earth. This is because Venus orbits the Sun at a distance that is closer to Earth's orbit than any other planet.

Venus and Earth are often referred to as "sister planets" because of their similar size, mass, and proximity to the Sun. The distance between Earth and Venus can range from about 38 million kilometers (about 24 million miles) at their closest approach, known as inferior conjunction, to about 261 million kilometers (about 162 million miles) when they are on opposite sides of the Sun, known as superior conjunction.

Mars can also be relatively close to Earth, especially when both planets are near their closest approach in their respective orbits, an event that occurs approximately every 26 months. However, even at its closest, Mars is generally farther from Earth than Venus.

It's important to note that the distances between planets change constantly as they orbit the Sun, so the closest planet can vary depending on the specific positions of Earth and the other planets in their orbits at any given time.

## Demo #3: Working with Docker AI Models from C#
Update your Docker Desktop application to the latest version.
We will next explore how to interact with Docker AI Models from a C# console application. Let’s see how this can be done using SDKs from OpenAI and Microsoft Agent Framework.

## Interacting with a model in Docker Desktop
Click on Models in the left navigation then click on the “Browser models +” button:

In the search field, enter “llama”, then choose the “llama3.2” model by clicking on the “Pull” link.

After the SLM model is fully downloaded, it is displayed the list of local models. Click on the Run arrow to interact with the model

You can ask the model some questions.

Click on the “Docker Hub” tab at the top.

## Interacting with a model in CLI
docker model list

docker model run llama3.2
> What is the most poisonous snake?
The most poisonous snake is often debated among experts, as the venom toxicity and potency can vary depending on the source and method of measurement. However, according to the Guinness World Records and many scientific studies, the inland taipan (Oxyuranus microlepidotus) is considered the world's most venomous snake.

The inland taipan, also known as the fierce snake, is found in the deserts of central Australia. Its venom is a powerful neurotoxin that can kill a human being within 45 minutes if left untreated. The venom contains a potent mixture of neurotoxins, including alpha-toxins and beta-toxins, which can cause respiratory failure, cardiovascular collapse, and renal failure.
Type /bye to exit.
### Pull, run and enable model
docker model list
docker model pull ai/ministral3:latest
docker desktop enable model-runner --tcp=12345
### OpenAI SDK
Create a text file named SentimentDockerOpenAI.cs and add to it this “File-based C# app” code.
#:package OpenAI@*-*

using OpenAI;
using OpenAI.Chat;
using System.ClientModel;
using System.Text;

var model = "ai/ministral3:latest";
var baseUrl = "http://localhost:12345/engines/llama.cpp/v1"; // root URL for local OpenAI-like server
var apikey = "unused";

OpenAIClientOptions options = new OpenAIClientOptions();
options.Endpoint = new Uri(baseUrl);
ApiKeyCredential credential = new ApiKeyCredential(apikey);
ChatClient client = new OpenAIClient(credential, options).GetChatClient(model);

// Build the prompt
StringBuilder prompt = new StringBuilder();
prompt.AppendLine("You will analyze the sentiment of the following product reviews.");
prompt.AppendLine("Each line is its own review. Output the sentiment of each review in");
prompt.AppendLine("a bulleted list and then provide a general sentiment of all reviews.");
prompt.AppendLine();
prompt.AppendLine("I bought this product and it's amazing. I love it!");
prompt.AppendLine("This product is terrible. I hate it.");
prompt.AppendLine("I'm not sure about this product. It's okay.");
prompt.AppendLine("I found this product based on the other reviews. It worked");

// send the prompt to the model and wait for the text completion
var response = await client.CompleteChatAsync(prompt.ToString());
// display the response
Console.WriteLine(response.Value.Content[0].Text);
Run the application with:
dotnet run SentimentDockerOpenAI.cs
This is a sample of the output:
Here is the sentiment analysis for each review:

- **I bought this product and it's amazing. I love it!** → **Positive**
- **This product is terrible. I hate it.** → **Negative**
- **I'm not sure about this product. It's okay.** → **Neutral**
- **I found this product based on the other reviews. It worked** → **Positive**
### Microsoft Agent Framework (MAF) SDK
Create a text file named FunnyDockerMAF.cs and add to it this “File-based C# app” code.
#:package Microsoft.Agents.AI.OpenAI@*-*


using System.ClientModel;
using Microsoft.Agents.AI;
using OpenAI;
using OpenAI.Chat;

var model = "ai/ministral3:latest";
var baseUrl = "http://localhost:12345/engines/llama.cpp/v1";

// Create an OpenAI-compatible ChatClient pointing at the local Docker model
var openAIClient = new OpenAIClient(new ApiKeyCredential("unused"), new OpenAIClientOptions {
Endpoint = new Uri(baseUrl)
});
var chatClient = openAIClient.GetChatClient(model);

// Wrap it as a Microsoft Agent Framework AIAgent
AIAgent agent = chatClient.AsAIAgent(
name: "FunnyChatbot",
instructions: "You are a useful chatbot. Always reply in a funny way with short answers.");

// Use a session to maintain multi-turn conversation context
AgentSession session = await agent.CreateSessionAsync();

while (true) {
Console.Write("\nUser: ");
var userInput = Console.ReadLine();
if (string.IsNullOrWhiteSpace(userInput)) break;

Console.Write("\nAI: ");
await foreach (var update in agent.RunStreamingAsync(userInput, session)) {
if (!string.IsNullOrEmpty(update.Text)) {
Console.Write(update.Text);
}
}
Console.WriteLine();
}
Run the app with this command:
dotnet run FunnyDockerMAF.cs
This is a sample of the output:
User: Tell me about the moon.

AI: Oh, the Moon? That dusty space donut floating around Earth!

- **Name**: Luna, because she’s got *phases*—like a bad relationship.
- **Cratered Face**: She’s got more pimples (craters) than a teenager.
- **Cheese or Rock?**: Not cheese—just sad, grey, rock face.
- **Lunatic**: Probably why they say "moonstruck" (but it's just Earth’s gravity being a drama queen).
- **Distance**: About 238,855 miles away—far enough to avoid awkward small talk.
- **Tides?**: She’s basically Earth’s cosmic roommate, ruffling our oceans like a messy bedsheet.

Fun fact: The Moon is slowly drifting away (~1.5 inches/year). One day, Earth will just be like, *"Bye, Moon—take the space!"*

Want to know something *really* weird? The Moon’s got *quakes*—but they’re more like cosmic hiccups. 🌕😂
