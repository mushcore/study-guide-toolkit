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
    Endpoint = new Uri("http://127.0.0.1:11434/v1")
});
var client = openAIClient.GetChatClient("phi4:14b");

var messages = new List<ChatMessage>
{
    ChatMessage.CreateSystemMessage("You specialize in the solar system"),
    ChatMessage.CreateUserMessage(
        "which planet is closest to earth?"
    ),

};

var options = new ChatCompletionOptions();

options.MaxOutputTokenCount = 2048;
options.Temperature = 0.8f;
options.TopP = 0.1f;

var completion = await client.CompleteChatAsync(messages, options);
Console.WriteLine($"[Model Response] {completion.Value.Content[0].Text}");