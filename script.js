const numberToMarker = {
    1: 'X',
    2: 'O',
}

const gameOutcome = {
    tie: -1,
    winPlayer1: 1,
    winPlayer2: 2
}

const playerNames = {
    player1: '',
    player2: ''
}

const gameOutcomeToMessage = {
    [gameOutcome.tie]: () => "It's a tie!",
    [gameOutcome.winPlayer1]: () => `${playerNames.player1} wins!`,
    [gameOutcome.winPlayer2]: () => `${playerNames.player2} wins!`,
}

const checkIfSubset = (parentArray, subsetArray) => subsetArray.every((el) => parentArray.includes(el));

const checkGameOutcome = (currMoveWinOutcome, currPlayer) => {
    if (currPlayer.getMarkers().length === 5 && !currMoveWinOutcome) {
        return gameOutcome.tie;
    } else if (currMoveWinOutcome && currPlayer.marker === 1) {
        return gameOutcome.winPlayer1;
    } else if (currMoveWinOutcome && currPlayer.marker === 2) {
        return gameOutcome.winPlayer2;
    }
}

const gameBoard = (function () {
    const board = ['', '', '', '', '', '', '', '', ''];
    const updateGameBoard = (index, marker) => {
        if (board[index] === '') {
            board[index] = marker;
        }
    };
    const resetGameBoard = () => {
        board.forEach((el, idx) => {
            board[idx] = '';
        });
    };
    return {board, updateGameBoard, resetGameBoard};
})();


const game = (function () {
    const gBoard = gameBoard;
    const gameWins = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 4, 7], [2, 5, 8], [3, 6, 9], [1, 5, 9], [3, 5, 7]];
    let playerTurn = null;
    let player1 = null;
    let player2 = null;
    const startGame = (playerName1, playerName2) => {
        gBoard.resetGameBoard();
        player1 = fabricatePlayer(playerName1, 1);
        player2 = fabricatePlayer(playerName2, 2);
        playerTurn = player1;
        setPlayerNames();
        renderBoard();
        setPlayerTurnStyle();
    };

    const setPlayerNames = () => {
        player1.name = document.querySelector('#name_player_1').value;
        player2.name = document.querySelector('#name_player_2').value;
        playerNames.player1 = player1.name;
        playerNames.player2 = player2.name;
    }
    const checkForGameOver = (playerMarkers) => {
        const outcomeCurrMove = gameWins.some((winMarkerBlock) => {
            return checkIfSubset(playerMarkers, winMarkerBlock) && playerMarkers.length > 2 || false;
        });
        const gameOutcome = checkGameOutcome(outcomeCurrMove, playerTurn);
        if (gameOutcome) {
            displayOutcomeMessage(gameOutcome);
        }
    };

    const displayOutcomeMessage = (gameOutcome) => {
        renderBoard(gameOutcomeToMessage[gameOutcome]());
    }

    const setPlayerTurnStyle = () => {
        document.querySelectorAll('.player').forEach((el) => el.classList.remove('active'));
        document.querySelector(`#player${playerTurn.marker}`).classList.add('active');
    }
    const setMarker = (event) => {
        if (playerTurn) {
            const selectedFieldIndex = event.target.getAttribute('id').split('_')[1];
            gBoard.updateGameBoard(selectedFieldIndex, numberToMarker[playerTurn.marker]);
            playerTurn.addMarker(parseInt(selectedFieldIndex) + 1);
            renderBoard();
            checkForGameOver(playerTurn.getMarkers());
            if (playerTurn === player1) {
                playerTurn = player2;
            } else {
                playerTurn = player1;
            }
            setPlayerTurnStyle();
        }
    };
    return {setMarker, startGame, setPlayerNames};
})();

const fabricatePlayer = (name, marker) => {
    const setMarkers = [];
    const addMarker = (fieldIndex) => {
        setMarkers.push(fieldIndex);
        setMarkers.sort();
    };
    const getMarkers = () => setMarkers;
    return {name, marker, addMarker, getMarkers};
}

const render = (messageCont) => {
    document.querySelector('#app').innerHTML = getHTML(messageCont);
    renderBoard(messageCont)
    unbind();
    bind();
}

const renderBoard = (messageCont) => {
    document.querySelector('.board_message_container').innerHTML = `
        <div class="board_container">
            ${board()}
            </div>
            ${message(messageCont)}
    `;
    unbind();
    bind();
}

const unbind = () => {
    const fields = document.querySelectorAll('.board_item');
    fields.forEach((field) => {
        field.removeEventListener('click', game.setMarker.bind(event));
    });

    const startBtn = document.querySelector('.start_btn');
    startBtn.removeEventListener('click', startBtnEventFn);

    const nameInputs = document.querySelectorAll('input');
    nameInputs.forEach((input) => {
        input.removeEventListener('change', game.setPlayerNames);
    });
}

const bind = () => {
    const fields = document.querySelectorAll('.board_item');
    fields.forEach((field) => {
        field.addEventListener('click', game.setMarker.bind(event));
    });

    const startBtn = document.querySelector('.start_btn');
    startBtn.addEventListener('click', startBtnEventFn);

    const nameInputs = document.querySelectorAll('input');
    nameInputs.forEach((input) => {
        input.addEventListener('change', game.setPlayerNames);
    });
}

const startBtnEventFn = () => {
    game.startGame(document.querySelector('#name_player_1').value, document.querySelector('#name_player_2').value);
}

const board = () => {
    return gameBoard.board.map((field, index) => {
        return `<div class="board_item" id="item_${index}">${field}</div>`;
    }).join('');
}

const startButton = () => {
    return `<div class="start_btn_container">
            <button class="start_btn">Start New Game</button>
        </div>`;
}

const playerOverview = () => {
    return `<div class="player_names">
            <div class="player" id="player1">
                <label for="name_player_1">Player - X:</label> <input type="text" name="name_player_1" value="Name 1"
                                                                         id="name_player_1">
            </div>
            <div class="player" id="player2">
                <label for="name_player_2">Player - O:</label> <input type="text" name="name_player_2" value="Name 2"
                                                                         id="name_player_2">
            </div>
        </div>`;
}

const message = (messageContent) => {
    return messageContent ? `<div class="message">${messageContent}</div>` : '';
}

const getHTML = () => {
    return `<h1>Tic Tac Toe</h1>
    <div class="body_container">
        <div class="board_message_container">

        </div>
    </div>
    <div class="player_btn_container">
        ${playerOverview()}
        ${startButton()}
    </div>`;
}

render('Start a game!');



