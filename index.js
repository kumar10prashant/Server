const { Server } = require('socket.io');
const http = require('http');

// Create an HTTP server to handle requests
const server = http.createServer();
const io = new Server(server);

let Player = [];
let RoomCount = 0;

let Counter = 0;
let Grid = [];




io.on('connection',(socket) =>{
    
console.log(socket.id);
if(Player.length > 0){
    RoomCount++;
    socket.join(RoomCount);
    Player[0].join(RoomCount);

    io.to(RoomCount).emit("RoomId",`${RoomCount}`);
    io.to(socket.id).emit("PlayerMove","X");
    io.to(Player[0].id).emit("PlayerMove","O");
    io.to(Player[0].id).emit("ChanceChange","Update");

   

    io.to(RoomCount).emit("Players",socket.id);
    io.to(RoomCount).emit("Players",Player[0].id);
    
    Player.shift();

    
    Grid = ["","","","","","","","",""];
}
else{
    Player.push(socket);
    console.log("waitng");


}

socket.on("SendMessage",(msg)=>{
    
 
   const parsedData = JSON.parse(`${msg}`);
   
  
   
    io.to(parsedData.RoomId).emit("SendMessage",parsedData.Message);
});

socket.on("ChanceChange",(msg)=>{

   
    
    io.to((msg)).emit("ChanceChange","Change");
})

socket.on("Win",(msg)=>{
    io.to(msg).emit("GameEnd");
})

socket.on("Move",(msg) => {
const data = JSON.parse(`${msg}`);
Grid[data.MoveIndex] = data.Move;
io.to(data.RoomId).emit("Move",msg);
console.log(msg);



console.log(Grid);
});

});
console.log("Start");

const PORT = 3000;
const HOST = '0.0.0.0';  // This allows the server to be accessed from external devices on the same network
server.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});