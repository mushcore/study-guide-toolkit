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
