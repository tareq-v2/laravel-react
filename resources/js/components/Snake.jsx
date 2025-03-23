// resources/js/components/Snake.js
import React, { useState } from 'react';

const Snake = () => {
    // Define the board size
    const boardSize = 10;

    // Define snakes and ladders
    const Snake = {
        // Ladders
        4: 14,
        9: 31,
        20: 38,
        28: 84,
        40: 59,
        51: 67,
        63: 81,
        // Snakes
        17: 7,
        54: 34,
        62: 19,
        64: 60,
        87: 24,
        93: 73,
        95: 75,
        99: 78,
    };

    // State for players' positions
    const [players, setPlayers] = useState({
        player1: 1,
        player2: 1,
    });

    // State for current player
    const [currentPlayer, setCurrentPlayer] = useState('player1');

    // State for dice roll
    const [diceRoll, setDiceRoll] = useState(0);

    // State for game over
    const [gameOver, setGameOver] = useState(false);

    // Function to roll the dice
    const rollDice = () => {
        if (gameOver) return;

        const roll = Math.floor(Math.random() * 6) + 1;
        setDiceRoll(roll);

        movePlayer(roll);
    };

    // Function to move the player
    const movePlayer = (steps) => {
        setPlayers((prevPlayers) => {
            const newPosition = prevPlayers[currentPlayer] + steps;

            // Check if the player has won
            if (newPosition >= boardSize * boardSize) {
                setGameOver(true);
                return prevPlayers;
            }

            // Check for snakes or ladders
            const updatedPosition = Snake[newPosition] || newPosition;

            return {
                ...prevPlayers,
                [currentPlayer]: updatedPosition,
            };
        });

        // Switch to the next player
        setCurrentPlayer((prevPlayer) =>
            prevPlayer === 'player1' ? 'player2' : 'player1'
        );
    };

    // Function to reset the game
    const resetGame = () => {
        setPlayers({
            player1: 1,
            player2: 1,
        });
        setCurrentPlayer('player1');
        setDiceRoll(0);
        setGameOver(false);
    };

    // Render the board
    const renderBoard = () => {
        const board = [];
        let counter = 1;

        for (let row = 0; row < boardSize; row++) {
            const cells = [];
            for (let col = 0; col < boardSize; col++) {
                const cellNumber = row % 2 === 0 ? counter : boardSize * (row + 1) - col;
                const isPlayer1 = players.player1 === cellNumber;
                const isPlayer2 = players.player2 === cellNumber;

                cells.push(
                    <div
                        key={cellNumber}
                        style={{
                            width: '40px',
                            height: '40px',
                            border: '1px solid black',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: isPlayer1
                                ? 'blue'
                                : isPlayer2
                                ? 'red'
                                : 'white',
                            color: isPlayer1 || isPlayer2 ? 'white' : 'black',
                        }}
                    >
                        {cellNumber}
                    </div>
                );
                counter++;
            }
            board.push(
                <div key={row} style={{ display: 'flex' }}>
                    {cells}
                </div>
            );
        }

        return board;
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Snakes and Ladders</h1>
            <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    {renderBoard()}
                </div>
            </div>

            {/* Dice Roll and Player Info */}
            <div style={{ marginBottom: '20px' }}>
                <h2>
                    Current Player: {currentPlayer === 'player1' ? 'Player 1 (Blue)' : 'Player 2 (Red)'}
                </h2>
                <h3>Dice Roll: {diceRoll}</h3>
                <button onClick={rollDice} disabled={gameOver}>
                    Roll Dice
                </button>
            </div>

            {/* Game Over Message */}
            {gameOver && (
                <div>
                    <h2>
                        {players.player1 >= boardSize * boardSize
                            ? 'Player 1 Wins!'
                            : 'Player 2 Wins!'}
                    </h2>
                    <button onClick={resetGame}>Play Again</button>
                </div>
            )}
        </div>
    );
};

export default Snake;