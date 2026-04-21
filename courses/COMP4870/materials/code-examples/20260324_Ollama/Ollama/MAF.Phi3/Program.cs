using Microsoft.Agents.AI;
using Microsoft.Extensions.AI;
using OllamaSharp;

string ollamaUrl = "http://localhost:11434/";
string modelId = "phi3:latest";
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
