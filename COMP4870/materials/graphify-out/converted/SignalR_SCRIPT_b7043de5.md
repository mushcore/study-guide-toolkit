<!-- converted from SignalR_SCRIPT.docx -->

# Build SignalR App with ASP.NET Core
### Project
mkdir SignalrChat
cd SignalrChat
dotnet new webapp --no-https
code .
## Chat Hub
### Add the SignalR client library
We will use Library Manager (LibMan) to get the client library from unpkg. unpkg is a content delivery network (CDN)) that can deliver anything found in npm, the Node.js package manager.
Run the following command if you do not already have LibMan:
dotnet tool install -g Microsoft.Web.LibraryManager.Cli
Run the following command to get the SignalR client library by using LibMan. You might have to wait a few seconds before seeing output.
libman install @aspnet/signalr -p unpkg -d wwwroot/lib/signalr --files dist/browser/signalr.js --files dist/browser/signalr.min.js
The parameters specify the following options:
- Use the unpkg provider.
- Copy files to the wwwroot/lib/signalr destination.
- Copy only the specified files.
In the SignalrChat project folder, create a Hubs folder. In the Hubs folder, create a ChatHub.cs file with the following code:
public class ChatHub : Hub {
public async Task SendMessage(string user, string message) {
await Clients.All.SendAsync("ReceiveMessage", user, message);
}
}
The ChatHub class inherits from the SignalR Hub class. The Hub class manages connections, groups, and messaging.
The SendMessage method can be called by a connected JavaScript client to send a message to all clients.
### Configure SignalR
Append this code to the Program.cs before “var app = builder.Build();”:
builder.Services.AddSignalR();
Add this code to Program.cs. Put it after “app.UseAuthorization();”:
app.MapHub<ChatHub>("/chatHub");
### Add SignalR client code
Replace the content in Pages/Index.cshtml with the following code:
@page
<div class="container">
<div class="row">&nbsp;</div>
<div class="row">
<div class="col-6">&nbsp;</div>
<div class="col-6">
User..........<input type="text" id="userInput" />
<br />
Message...<input type="text" id="messageInput" />
<input type="button" id="sendButton" value="Send Message" />
</div>
</div>
<div class="row">
<div class="col-12">
<hr />
</div>
</div>
<div class="row">
<div class="col-6">&nbsp;</div>
<div class="col-6">
<ul id="messagesList"></ul>
</div>
</div>
</div>
<script src="~/lib/signalr/dist/browser/signalr.js"></script>
<script src="~/js/chat.js"></script>
The preceding code:
- Creates text boxes for name and message text, and a submit button.
- Creates a list with id="messagesList" for displaying messages that are received from the SignalR hub.
- Includes script references to SignalR and the chat.js application code that will be created in the next step.
We will not need Pages/Index.cshtml.cs so you can go ahead and delete that file.
In the wwwroot/js folder, create a chat.js file with the following code:
"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

//Disable send button until connection is established
document.getElementById("sendButton").disabled = true;

connection.on("ReceiveMessage", function (user, message) {
var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
var encodedMsg = user + " says " + msg;
var li = document.createElement("li");
li.textContent = encodedMsg;
document.getElementById("messagesList").appendChild(li);
});

connection.start().then(function(){
document.getElementById("sendButton").disabled = false;
}).catch(function (err) {
return console.error(err.toString());
});

document.getElementById("sendButton").addEventListener("click", function (event) {
var user = document.getElementById("userInput").value;
var message = document.getElementById("messageInput").value;
connection.invoke("SendMessage", user, message).catch(function (err) {
return console.error(err.toString());
});
event.preventDefault();
});

Run the app by typing “dotnet run” in the terminal window.
Enter a User and a Message. When you click on the “Send Message” button, the message will appear below the button.

Copy the URL and open the same page in another browser (or another instance of the same browser). Enter another message. The new message will appear in both browsers.


## Draw Hub
Let us add a more interesting app that does some drawing.
In the Hubs folder, create a DrawDotHub.cs file with the following code:
public class DrawDotHub: Hub {
public async Task UpdateCanvas(int x, int y) {
await Clients.All.SendAsync("updateDot",x, y);
}

public async Task ClearCanvas() {
await Clients.All.SendAsync("clearCanvas");
}
}
Add this code to Program.cs right after app.UseAuthorization():
app.MapHub<DrawDotHub>("/drawDotHub");
Rename Pages/Privacy.cshtml to Pages/Draw.cshtml. We will not need Pages/Privacy.cshtml.cs so you can go ahead and delete that file.
Replace the content in Pages\Draw.cshtml with the following code:
@page
<style>
/* Some CSS styling */
.rightside {
float: left;
margin-left: 10px;
}

#sketchpad {
float: left;
height: 300px;
width: 600px;
border: 2px solid #888;
border-radius: 4px;
position: relative; /* Necessary for correct mouse co-ords in Firefox */
}

#clear_button, #save_button {
float: left;
font-size: 15px;
padding: 10px;
-webkit-appearance: none;
background: #feee;
border: 1px solid #888;
margin-bottom: 5px;
}
</style>

<h1>SignalR Sketchpad</h1>
<div id="sketchpadapp">
<div class="rightside">
<button id="clear_button" onclick="tellServerToClear()">Clear Canvas</button>
<br />
<canvas id="sketchpad" width="600" height="300"></canvas>
</div>
</div>

<script src="~/lib/signalr/dist/browser/signalr.js"></script>
<script src="~/js/draw.js"></script>
The preceding code:
- Creates a drawing canvas.
- Creates a “Clear Canvas” button right above the canvas
- Includes script references to SignalR and the draw.js application code that will be created in the next step.
In the wwwroot/js folder, create a draw.js file with the following code:
"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/drawDotHub").build();

connection.on("updateDot", function (x, y) {
drawDot(x, y, 8);
});

connection.on("clearCanvas", function () {
ctx.clearRect(0, 0, canvas.width, canvas.height);
});

connection.start().then(function () {
// nothing here
}).catch(function (err) {
return console.error(err.toString());
});

function tellServerToClear() {
connection.invoke("ClearCanvas").catch(function (err) {
return console.error(err.toString());
});
}
//////////////////////////////////////////////////////
// Variables for referencing the canvas and 2dcanvas context
var canvas, ctx;
// Variables to keep track of the mouse position and left-button status
var mouseX, mouseY, mouseDown = 0;
// Draws a dot at a specific position on the supplied canvas name
// Parameters are: A canvas context, the x position, the y position, the size of the dot
function drawDot(x, y, size) {
// Let's use black by setting RGB values to 0, and 255 alpha (completely opaque)
var r = 0;
var g = 0;
var b = 0;
var a = 255;
// Select a fill style
ctx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + (a / 255) + ")";
// Draw a filled circle
ctx.beginPath();
ctx.arc(x, y, size, 0, Math.PI * 2, true);
ctx.closePath();
ctx.fill();
}

// Keep track of the mouse button being pressed and draw a dot at current location
function sketchpad_mouseDown() {
mouseDown = 1;
drawDot(mouseX, mouseY, 8);

connection.invoke("UpdateCanvas", mouseX, mouseY).catch(function (err) {
return console.error(err.toString());
});
}

// Keep track of the mouse button being released
function sketchpad_mouseUp() {
mouseDown = 0;
}

// Keep track of the mouse position and draw a dot if mouse button is currently pressed
function sketchpad_mouseMove(e) {
// Update the mouse co-ordinates when moved
getMousePos(e);
// Draw a dot if the mouse button is currently being pressed
if (mouseDown == 1) {
drawDot(mouseX, mouseY, 8);
connection.invoke("UpdateCanvas", mouseX, mouseY).catch(function (err) {
return console.error(err.toString());
});
}
}

// Get the current mouse position relative to the top-left of the canvas
function getMousePos(e) {
if (!e)
var e = event;
if (e.offsetX) {
mouseX = e.offsetX;
mouseY = e.offsetY;
}
else if (e.layerX) {
mouseX = e.layerX;
mouseY = e.layerY;
}
}

// Set-up the canvas and add our event handlers after the page has loaded
// Get the specific canvas element from the HTML document
canvas = document.getElementById('sketchpad');
// If the browser supports the canvas tag, get the 2d drawing context for this canvas
if (canvas.getContext)
ctx = canvas.getContext('2d');

// Check that we have a valid context to draw on/with before adding event handlers
if (ctx) {
// React to mouse events on the canvas, and mouseup on the entire document
canvas.addEventListener('mousedown', sketchpad_mouseDown, false);
canvas.addEventListener('mousemove', sketchpad_mouseMove, false);
window.addEventListener('mouseup', sketchpad_mouseUp, false);
}
else {
document.write("Browser not supported!!");
}

Run the app by typing “dotnet run” in the terminal window. Point your browser to http://localhost:5000/draw.

### Inspection
- Hit F12 in browser >> Network:

