let key = -1;
	let numPlayer = -1;
	let turn = 0;
	let board = [-1,-1,-1,-1,-1,-1,-1,-1,-1];
	let player = -1;
	const socket =new WebSocket('ws://localhost:3000');

	const sendMsg = (sentObj)=>{
		socket.send(JSON.stringify(sentObj));
	};

	socket.addEventListener('message',function(event){
		let elem;
		try {
        	elem = JSON.parse(event.data);
		} catch(error) {
			alert("error: "+error); 
        }
		if('errMsg' in elem)
		{
			let h2 = document.getElementsByTagName("h2")[0];
			if(h2)
				h2.innerHTML = "Message: " + elem.errMsg;

			if ("player left, not enough players".localeCompare(elem.errMsg)==0)
			{
				if(h2)
					h2.innerHTML = "Message: " + elem.errMsg + " waiting for another player...";
				drawBoard([-1,-1,-1,-1,-1,-1,-1,-1,-1]);
				updateScore([0,0]);
				document.getElementsByClassName("game--restart")[0].style.visibility = 'hidden';
				turn = 0;
			}
		}
		if('key' in elem)
		{
			key = elem.key;
			numPlayer = elem.turn;
			checkIfItMyTurn();
		}
		if("board" in elem)
		{
			turn = elem.turn;
			checkIfItMyTurn();
			drawBoard(elem.board);
			if (elem.isWon!=-1)
			{
				let h2 = document.getElementsByTagName("h2")[0];
				if(elem.isWon==2)
					h2.innerHTML = "A Tie";
				else if(h2 && elem.isWon==numPlayer)
					h2.innerHTML = "You Won";
				else if(h2 && elem.isWon!=numPlayer)
					h2.innerHTML = "You Lost";	

				let cells = document.getElementsByClassName("cell");
				for (let i = 0; i < cells.length; i++) 
					cells[i].removeAttribute("onclick");
				document.getElementsByClassName("game--restart")[0].style.visibility = 'visible';
				updateScore(elem.score);
			}
			else
			document.getElementsByClassName("game--restart")[0].style.visibility = 'hidden';

		}
    });

	function addSymbol(id){
		let message = {
			"index":id,
			"key":key,
			"turn":turn,
		};
		sendMsg(message);
	}
	function drawBoard(board)
	{
		for (let i = 0; i < board.length; i++) {
			let cell = document.getElementById(""+i);
			if(board[i]!=-1)
			{
				if(board[i] == 0)
					cell.innerHTML = "X"
				else
					cell.innerHTML = "O"
			}
			else
				cell.innerHTML ="";
		}
	}
	function updateScore(scorePlayers)
	{
		let scoreBoard = "Score: You: ";
		scoreBoard = scoreBoard +scorePlayers[numPlayer]+" | Apponent: ";
		scoreBoard += scorePlayers[(numPlayer+1)%2];
		document.getElementsByTagName("h3")[0].innerHTML = scoreBoard;
	}
	function restartGame()
	{
		document.getElementsByClassName("game--restart")[0].style.visibility = 'hidden';
		sendMsg({restart:true});
	}
	function checkIfItMyTurn()
	{
		if(numPlayer==turn)
			{
				let h2 = document.getElementsByTagName("h2")[0];
				if(h2)
					h2.innerHTML = "It is your turn";
					let cells = document.getElementsByClassName("cell");
				for (let i = 0; i < cells.length; i++) 
					cells[i].setAttribute('onclick',"addSymbol(this.id)");
			}
			else
			{
				let h2 = document.getElementsByTagName("h2")[0];
				if(h2)
					h2.innerHTML = "It is not your turn";
				let cells = document.getElementsByClassName("cell");
				for (let i = 0; i < cells.length; i++) 
					cells[i].removeAttribute("onclick");
				
			}
	}