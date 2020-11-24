const express = require('express');
const app = express();
const server = require('http').createServer(app);
const websocket = require('ws');
const game = require('./gameLogistics');
const wss = new websocket.Server({server:server});
const path = require('path');
const messageTemp = {
    board:[-1,-1,-1,-1,-1,-1,-1,-1,-1],
    turn:0,
    isWon :"",
    score :[0,0],
}
wss.on('connection',function connection(ws){
    //new player
    console.log('A new client got here no. '+wss.clients.size);
    let player = game.addPlayer();
    if(Object.keys(player).length != 0)
    {
        if (game.isEnoughPlayers()) {
            //we assign each player his data after we have enough players
            let index = 0;
            wss.clients.forEach(client => {
                if (client.readyState == websocket.OPEN)
                {
                    let playerData = game.getPlayer(index);
                    index++;
                    if(Object.keys(playerData).length != 0)
                        client.send(JSON.stringify(playerData));
                }
            });
        }
        else
            ws.send(JSON.stringify({errMsg:"Not enough players , please wait for more players to join"}));
    }
    else
    {
        ws.send(JSON.stringify({errMsg:"sorry, too much enough players, try again later"}));
        ws.close();
    }

    //move making
    ws.on('message',function recieve(message){
        let msg;
        try {
        	msg = JSON.parse(message);
		} catch(error) {
            console.log("There has been a wrong format sent shutting down connection");
            ws.close();
		}
        if('restart' in msg)
        {
            game.resetGame();
            messageTemp.board = game.getBoardStatus();
            messageTemp.turn = game.getTurn();
            messageTemp.isWon =-1;
            messageTemp.score = game.getScore();
            wss.clients.forEach(client => {
                if (client.readyState == websocket.OPEN)
                    client.send(JSON.stringify(messageTemp));
            });
        }
        if('key' in msg)
        {
            if(game.checkPlayer(msg.key,msg.turn))
            {
                if(game.addSymbol(msg.index))
                {   // send all the players the new board
                    messageTemp.board = game.getBoardStatus();
                    messageTemp.turn = game.getTurn();
                    let victory =game.checkVictory();
                    messageTemp.isWon = victory;
                    if(victory ==0 || victory ==1)
                        game.addScore(victory);
                    messageTemp.score = game.getScore();
                    wss.clients.forEach(client => {
                        if (client.readyState == websocket.OPEN)
                            client.send(JSON.stringify(messageTemp));
                    });                
                }
                else
                    ws.send(JSON.stringify({errMsg:"tile already placed"}));
            }
            else
                ws.send(JSON.stringify({errMsg:"you are not a player"}));
        }
    });
    //when player has exited
    ws.on('close',function recieve(message){
        console.log("closing connection");
        game.clearGame();
        game.nullPlayerNumbers();
        wss.clients.forEach(client => {
            if (client.readyState == websocket.OPEN)
            {
                client.send(JSON.stringify({errMsg:"player left, not enough players"}));
                let player = game.addPlayer();
            }
        });
        });
    });
app.get('/',(req,res) =>{
    res.sendFile(path.join(__dirname ,'..','client/index.html'));
});
app.get('/indexClient.js',(req,res) =>{
    res.sendFile(path.join(__dirname ,'..','client/indexClient.js'));
});
app.get('/styleClient.css',(req,res) =>{
    res.sendFile(path.join(__dirname ,'..','client/styleClient.css'));
});
server.listen(3000,()=>{
    console.log('I am  on port: 3000');
});