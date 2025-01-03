import React, { useState } from "react";

const scores = [
  20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1,
];

const App = () => {
  const [players, setPlayers] = useState([]);
  const [numPlayers, setNumPlayers] = useState(0);
  const [playerNames, setPlayerNames] = useState([]);
  const [scoreHistory, setScoreHistory] = useState([]);
  const [gameType, setGameType] = useState("501"); // État pour le type de jeu

  const startGame = () => {
    const initialPlayers = Array.from({ length: numPlayers }, (_, index) => ({
      id: index,
      name: playerNames[index] || `Player ${index + 1}`,
      score: 0,
    }));
    setPlayers(initialPlayers);
    setScoreHistory(
      Array(numPlayers)
        .fill(null)
        .map(() => [])
    );
  };

  const updateScore = (playerId, score) => {
    setPlayers(
      players.map((player, index) =>
        player.id === playerId
          ? { ...player, score: player.score + score }
          : player
      )
    );
    setScoreHistory(
      scoreHistory.map((history, index) =>
        index === playerId ? [...history, score] : history
      )
    );
  };

  const undoScore = (playerId) => {
    const newHistory = scoreHistory.map((history, index) =>
      index === playerId ? history.slice(0, -1) : history
    );
    setScoreHistory(newHistory);

    const newScores = players.map((player, index) => {
      if (index === playerId) {
        const totalScore = newHistory[index].reduce(
          (acc, score) => acc + score,
          0
        );
        return { ...player, score: totalScore };
      }
      return player;
    });
    setPlayers(newScores);
  };

  const resetGame = () => {
    setPlayers([]);
    setNumPlayers(0);
    setPlayerNames([]);
    setScoreHistory([]);
  };

  const resetScores = () => {
    setPlayers(players.map((player) => ({ ...player, score: 0 }))); // Réinitialise les scores à zéro
  };

  const handleNameChange = (index, name) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const handleGameTypeChange = (type) => {
    setGameType(type);
  };

  return (
    <div>
      <h1>DartScoreMan</h1>
      <div style={{ position: "absolute", top: "10px", right: "10px" }}>
        <button
          onClick={() => handleGameTypeChange("301")}
          className={gameType === "301" ? "active-game-type" : ""}
        >
          301
        </button>
        <button
          onClick={() => handleGameTypeChange("501")}
          className={gameType === "501" ? "active-game-type" : ""}
        >
          501
        </button>
      </div>
      {players.length === 0 ? (
        <div className="player-input-container">
          <input
            type="number"
            value={numPlayers}
            onChange={(e) => {
              setNumPlayers(Number(e.target.value));
              setPlayerNames(Array(Number(e.target.value)).fill(""));
            }}
            placeholder="Number of players"
          />
          {Array.from({ length: numPlayers }).map((_, index) => (
            <input
              key={index}
              type="text"
              value={playerNames[index] || ""}
              onChange={(e) => handleNameChange(index, e.target.value)}
              placeholder={`Player ${index + 1} name`}
            />
          ))}
          <button onClick={startGame}>Commencer la partie</button>
        </div>
      ) : (
        <div>
          <button onClick={resetGame}>Reset Game</button>
          <button onClick={resetScores}>Reset Scores</button>
          <div className="players-grid">
            {players.map((player) => {
              const scoreToWin = gameType === "301" ? 301 : 501; // Détermine le score à atteindre
              const remainingScore = scoreToWin - player.score; // Calcule le score restant

              return (
                <div key={player.id} className="player">
                  <h4 style={{ textAlign: "right" }}>
                    {remainingScore}/{scoreToWin}
                  </h4>{" "}
                  {/* Affiche le score restant */}
                  <h2>
                    {player.name} <br /> Score: {player.score} / {gameType}
                  </h2>
                  <button onClick={() => undoScore(player.id)}>
                    Score précédent
                  </button>
                  <div className="score-buttons">
                    {scores.map((score) => (
                      <div key={score} style={{ marginBottom: "5px" }}>
                        <button
                          className="simple"
                          onClick={() => updateScore(player.id, score)}
                        >
                          {score}
                        </button>
                        <button
                          className="double"
                          onClick={() => updateScore(player.id, score * 2)}
                        >
                          {score * 2}
                        </button>
                        <button
                          className="triple"
                          onClick={() => updateScore(player.id, score * 3)}
                        >
                          {score * 3}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
