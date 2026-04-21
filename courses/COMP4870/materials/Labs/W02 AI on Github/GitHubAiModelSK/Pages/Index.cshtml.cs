using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.SemanticKernel.ChatCompletion;

namespace GitHubAiModelSK.Pages;

public class IndexModel : PageModel
{
    private readonly IChatCompletionService _chatCompletionService;

    public IndexModel(IChatCompletionService chatCompletionService)
    {
        _chatCompletionService = chatCompletionService;
    }

    [BindProperty]
    public string? UserMessage { get; set; }

    public List<ChatEntry> ChatMessages { get; set; } = new();

    public void OnGet()
    {
        // Clear chat history on fresh page load
        HttpContext.Session.Remove("ChatHistory");
    }

    public async Task<IActionResult> OnPostAsync()
    {
        if (string.IsNullOrWhiteSpace(UserMessage))
            return Page();

        // Retrieve existing chat history from session
        var historyJson = HttpContext.Session.GetString("ChatHistory");
        var chatEntries = string.IsNullOrEmpty(historyJson)
            ? new List<ChatEntry>()
            : System.Text.Json.JsonSerializer.Deserialize<List<ChatEntry>>(historyJson)!;

        // Build Semantic Kernel ChatHistory from saved entries
        ChatHistory chat = new(@"
            You are an AI assistant that helps people find information.
            The response must be brief and should not exceed one paragraph.
            If you do not know the answer then simply say 'I do not know the answer'.");

        foreach (var entry in chatEntries)
        {
            if (entry.Role == "User")
                chat.AddUserMessage(entry.Message);
            else
                chat.AddAssistantMessage(entry.Message);
        }

        // Add current user message
        chat.AddUserMessage(UserMessage);
        chatEntries.Add(new ChatEntry { Role = "User", Message = UserMessage });

        // Get AI response using streaming
        StringBuilder sb = new();
        await foreach (var message in _chatCompletionService
            .GetStreamingChatMessageContentsAsync(chat))
        {
            sb.Append(message.Content);
        }

        var response = sb.ToString();
        chatEntries.Add(new ChatEntry { Role = "Assistant", Message = response });

        // Save chat history back to session
        HttpContext.Session.SetString("ChatHistory",
            System.Text.Json.JsonSerializer.Serialize(chatEntries));

        ChatMessages = chatEntries;
        ModelState.Clear();
        UserMessage = string.Empty;

        return Page();
    }
}

public class ChatEntry
{
    public string Role { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
}
