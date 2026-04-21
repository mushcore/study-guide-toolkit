#:package Microsoft.Agents.AI.OpenAI@*-*


using System.ClientModel;
using Microsoft.Agents.AI;
using OpenAI;
using OpenAI.Chat;
using Microsoft.Extensions.AI;


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

var chatOptions = new ChatOptions {
    Temperature = 1f,
    MaxOutputTokens = 500,
};


/*
agent.RunStreamingAsync(userQuery,
        options: new ChatClientAgentRunOptions(chatOptions)))
*/

while (true) {
    Console.Write("\nUser: ");
    var userInput = Console.ReadLine();
    if (string.IsNullOrWhiteSpace(userInput)) break;

    Console.Write("\nAI: ");
    await foreach (var update in agent.RunStreamingAsync(userInput, options: new ChatClientAgentRunOptions(chatOptions))) {
        if (!string.IsNullOrEmpty(update.Text)) {
            Console.Write(update.Text);
        }
    }
    Console.WriteLine();
}
