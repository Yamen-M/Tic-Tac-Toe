const gameBoard = (() => {
    let board = [
        ['-','-','-'],
        ['-','-','-'],
        ['-','-','-']
    ];

    const boardCheck = () => {
        for(let i = 0; i < board.length; i++)
        {
            for(let j = 0; j < board[i].length; j++)
            {
                if(board[i][j] === '-' )
                    return false;
            }
        }
        return true;
    }

    const printBoard = () => {

        for(let i = 0; i < board.length; i++)
        {
            let row = '';
            for(let j = 0; j < board[i].length; j++)
            {
                row += board[i][j];

                if(j !== board[i].length - 1)
                    row += "\t";
            }
            console.log(row);
        }
    }

    const updateBoard = (index, marker) => {

        if(board[index.row][index.col] === '-')
        {
            board[index.row][index.col] = marker;

            printBoard();

            gameCheck(marker);
        }
        else{
            console.log("NO! no! NO!")
            alert("Place already taken! Input again!")
            gameFlow.forceTurnflag();
            gameFlow.playRound();
        }
    }

    const resetBoard = () => {

        for(let i = 0; i < board.length; i++)
        {
            for(let j = 0; j < board[i].length; j++)
            {
                board[i][j] = '-';
            }
        }
    }

    const checkWin = (marker) => {
    
        let combs = [
            [[0,0], [0,1], [0,2]],
            [[1,0], [1,1], [1,2]],
            [[2,0], [2,1], [2,2]],
            [[0,0], [1,0], [2,0]],
            [[0,1], [1,1], [2,1]],
            [[0,2], [1,2], [2,2]],
            [[0,0], [1,1], [2,2]],
            [[0,2], [1,1], [2,0]],
        ];

        for(let combo of combs)
        {
            if (board[combo[0][0]][combo[0][1]] === marker &&
            board[combo[1][0]][combo[1][1]] === marker &&
            board[combo[2][0]][combo[2][1]] === marker) { return true;}
        }

        return false;
    }

    const gameCheck = (marker) => {
        let winflag = checkWin(marker);
        let drawflag = boardCheck();

        if(drawflag && !winflag){

            console.log("GAME ENDED IN DRAW!")
        } 
        else if (!drawflag && winflag){
            gameFlow.forceTurnflag();
            let winner = gameFlow.getPlayerTurn();
            console.log(`Winner is ${winner.name}!`);
        }
        else if (!drawflag && !winflag)
        {
            gameFlow.playRound();
        }
    }

    return {printBoard, updateBoard, resetBoard}
})();

const Player = (name, marker) =>{
    const setMarker = (marker) => {}
    return {name, marker};
}

const gameFlow = (() => {

    let player1, player2, turnFlag = false;
    
    let playerDetails = () =>{

        const name = prompt("Enter your name: ");

        if(!player1){
            let marker = prompt("Choose your marker: X or O: ");
            while(marker !== "X" && marker !== "O"){
                marker = prompt("Choose either X or O! \nChoice: ");
            }
            return Player(name, marker);
        }
        else{
            if(player1.marker === "X")
                return Player(name, "O");
            else if(player1.marker === "O")
                return Player(name, "X");
        }
    }

    player1 = playerDetails();
    player2 = playerDetails();

    const getPlayerTurn = () => {
        if(turnFlag)
        {            
            turnFlag = false;
            return player2;
        }
        else{            
            turnFlag = true;
            return player1;
        }
    }

    const forceTurnflag = () => {
        if(turnFlag)
            turnFlag = false;
        else
            turnFlag = true;
    }

    const playRound = () => {
        let currentPlayer = getPlayerTurn();

        let index = {
            row: -1,
            col: -1
        }

        do {
            index.row = Number(prompt(`${currentPlayer.name}, choose your row (0, 1, or 2): `));
        } while(index.row < 0 || index.row > 2 || isNaN(index.row));

        do {
            index.col = Number(prompt(`${currentPlayer.name}, choose your column (0, 1 or 2): `));
        } while(index.col < 0 || index.col > 2 || isNaN(index.col));

        gameBoard.updateBoard(index, currentPlayer.marker);
    }

    const printPlayerDetails = () =>{ 
        console.log(`player1: name: ${player1.name} \t marker: ${player1.marker}`)
        console.log(`player2: name: ${player2.name} \t marker: ${player2.marker}`)
    }

    return{printPlayerDetails, playRound, forceTurnflag, getPlayerTurn}
})();

// gameBoard.printBoard();
// gameBoard.updateBoard({row: 1, col: 2}, "X")
// gameBoard.updateBoard({row: 1, col: 1}, "X")
// gameBoard.updateBoard({row: 1, col: 0}, "X")
// gameBoard.resetBoard();
// gameBoard.printBoard();

gameFlow.printPlayerDetails();
gameFlow.playRound()


