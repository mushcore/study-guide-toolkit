using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace SignalrChat.Hubs;

public class ChatHub : Hub {
    // JavaScript can dirtectly call this method
  public async Task SendMessage(string user, string message) {
    // The server calls a JavaScript function on the client named ReceiveMessage
    await Clients.All.SendAsync("ReceiveMessage", user, message);
  }
}
