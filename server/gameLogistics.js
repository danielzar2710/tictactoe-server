const crypto =require('crypto')
let board = [-1,-1,-1,-1,-1,-1,-1,-1,-1];
let turn = 0;
const numPlayers = 2;
let players = [];
const keySize = 12;
let playerTurnNumber=0;
let score = [0,0];

const getScore = function(){
    return score;
}
const addScore = function(player){
    score[player]++;
}
const createUniqeKey=function(){
    return crypto.randomBytes(keySize).toString('utf8'); 
}
const resetGame = function()
{
    board = [-1,-1,-1,-1,-1,-1,-1,-1,-1];
    turn = 0;   
}
const addPlayer=function()
{
    if(players.length<numPlayers)
    {
        let key = createUniqeKey();
        let player = {key:key,turn:playerTurnNumber};
        players.push(player);
        playerTurnNumber++;
        return player;
    }
    else
        return {};
}

const isEnoughPlayers = function()
{
    if (players.length == numPlayers)
        return true;
    return false;
}

const checkPlayer = function(key,turnNum){
    let test = false;
    players.forEach(player => {
       if(player.key.localeCompare(key)==0 && player.turn == turnNum)
            test =true;
    });
    return test;
}

const addSymbol = function (index)
{
    if (board[index] ==-1){
        board[index] = turn;
        turn = (turn + 1) % numPlayers;
        return true;
    }
    return false;
}

const checkVictory= function()
{
    //rows
    if(board[0]==board[1]&&board[1]==board[2]&&board[2]!=-1)
        return board[2];
    if(board[3]==board[4]&&board[4]==board[5]&&board[5]!=-1)
        return board[5];
    if(board[6]==board[7]&&board[7]==board[8]&&board[8]!=-1)
        return board[8];
    //columns
    if(board[0]==board[3]&&board[3]==board[6]&&board[6]!=-1)
        return board[6];
    if(board[1]==board[4]&&board[4]==board[7]&&board[7]!=-1)
        return board[7];
    if(board[2]==board[5]&&board[5]==board[8]&&board[8]!=-1)
        return board[8];
    //diagonals
    if(board[0]==board[4]&&board[4]==board[8]&&board[8]!=-1)
        return board[8];
    if(board[2]==board[4]&&board[4]==board[6]&&board[6]!=-1)
        return board[6];
    if (areAllTilesTaken())
        return 2;
    return -1;
}
const areAllTilesTaken = function()
{
    if(board[0]!=-1 && board[1]!=-1 && board[2]!=-1 
        && board[3]!=-1 && board[4]!=-1&& board[5]!=-1
        && board[6]!=-1&& board[7]!=-1 && board[8]!=-1)
        return true;
    return false;

}
const clearBoard = function()
{
    board = [-1,-1,-1,-1,-1,-1,-1,-1,-1];
}
const clearGame = function()
{
    score = [0,0];
    clearBoard();
    players = [];
    turn = 0;
}
const getTurn =function()
{
    return turn;
}
const getBoardStatus =function()
{
    return board;
}

const getPlayer= function(index){
    if(index<numPlayers)
        return players[index];
    return {};
}
const nullPlayerNumbers = function()
{
    playerTurnNumber=0;
}
module.exports = {
    getBoardStatus: getBoardStatus,
    getTurn:getTurn,
    checkVictory:checkVictory,
    clearBoard:clearBoard,
    addSymbol:addSymbol,
    addPlayer: addPlayer,
    isEnoughPlayers:isEnoughPlayers,
    checkPlayer:checkPlayer,
    clearGame:clearGame,
    getPlayer:getPlayer,
    resetGame:resetGame,
    getScore:getScore,
    addScore:addScore,
    nullPlayerNumbers:nullPlayerNumbers,
};

