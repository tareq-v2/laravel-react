// resources/js/components/Game.js
import React, { useState, useEffect } from 'react';

const Game = () => {
    const [playerPosition, setPlayerPosition] = useState(0);
    const [opponentPosition, setOpponentPosition] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [obstacles, setObstacles] = useState([]);
    const [score, setScore] = useState(0);

    // Generate random obstacles
    useEffect(() => {
        const obstacleInterval = setInterval(() => {
            if (!isPaused && !gameOver) {
                setObstacles((prevObstacles) => [
                    ...prevObstacles,
                    { id: Date.now(), position: Math.floor(Math.random() * 450) },
                ]);
            }
        }, 2000);

        return () => clearInterval(obstacleInterval);
    }, [isPaused, gameOver]);

    // Handle player movement
    useEffect(() => {
        const handleKeyPress = (event) => {
            if (!isPaused && !gameOver) {
                if (event.key === 'ArrowRight') {
                    setPlayerPosition((prevPosition) => Math.min(prevPosition + 10, 450));
                } else if (event.key === 'ArrowLeft') {
                    setPlayerPosition((prevPosition) => Math.max(prevPosition - 10, 0));
                }
            }
        };

        window.addEventListener('keydown', handleKeyPress);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [isPaused, gameOver]);

    // Handle opponent movement
    useEffect(() => {
        const opponentInterval = setInterval(() => {
            if (!isPaused && !gameOver) {
                setOpponentPosition((prevPosition) => Math.min(prevPosition + 5, 450));
            }
        }, 100);

        return () => clearInterval(opponentInterval);
    }, [isPaused, gameOver]);

    // Check for collisions and game over conditions
    useEffect(() => {
        if (playerPosition >= 450 || opponentPosition >= 450) {
            setGameOver(true);
        }

        // Check for collisions with obstacles
        obstacles.forEach((obstacle) => {
            if (
                playerPosition + 50 >= obstacle.position &&
                playerPosition <= obstacle.position + 50 &&
                !gameOver
            ) {
                setGameOver(true);
            }
        });

        // Update score
        if (!gameOver && !isPaused) {
            setScore((prevScore) => prevScore + 1);
        }
    }, [playerPosition, opponentPosition, obstacles, gameOver, isPaused]);

    // Reset the game
    const resetGame = () => {
        setPlayerPosition(0);
        setOpponentPosition(0);
        setObstacles([]);
        setGameOver(false);
        setScore(0);
        setIsPaused(false);
    };

    // Pause or resume the game
    const togglePause = () => {
        setIsPaused((prevPaused) => !prevPaused);
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Simple Racing Game</h1>
            <div style={{ position: 'relative', width: '500px', height: '200px', border: '1px solid black', margin: '0 auto' }}>
                {/* Player Car */}
                <div
                    style={{
                        position: 'absolute',
                        left: `${playerPosition}px`,
                        top: '10px',
                        width: '50px',
                        height: '30px',
                        backgroundColor: 'blue',
                    }}
                ></div>

                {/* Opponent Car */}
                <div
                    style={{
                        position: 'absolute',
                        left: `${opponentPosition}px`,
                        top: '60px',
                        width: '50px',
                        height: '30px',
                        backgroundColor: 'red',
                    }}
                ></div>

                {/* Obstacles */}
                {obstacles.map((obstacle) => (
                    <div
                        key={obstacle.id}
                        style={{
                            position: 'absolute',
                            left: `${obstacle.position}px`,
                            top: '120px',
                            width: '50px',
                            height: '20px',
                            backgroundColor: 'black',
                        }}
                    ></div>
                ))}
            </div>

            {/* Score Display */}
            <div style={{ marginTop: '20px' }}>
                <h2>Score: {score}</h2>
            </div>

            {/* Game Over Message */}
            {gameOver && (
                <div>
                    <h2>{playerPosition >= 450 ? 'You Win!' : 'You Lose!'}</h2>
                    <button onClick={resetGame}>Play Again</button>
                </div>
            )}

            {/* Pause/Resume Button */}
            <div style={{ marginTop: '20px' }}>
                <button onClick={togglePause}>
                    {isPaused ? 'Resume' : 'Pause'}
                </button>
            </div>
        </div>
    );
};

export default Game;