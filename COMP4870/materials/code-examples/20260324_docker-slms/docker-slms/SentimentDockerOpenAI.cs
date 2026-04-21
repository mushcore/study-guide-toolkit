#:package OpenAI@*-*

using OpenAI;
using OpenAI.Chat;
using System.ClientModel;
using System.Text;

var model = "ai/llama3.2:latest";
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
