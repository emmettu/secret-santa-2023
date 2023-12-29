import { useContext, useEffect, useState, useRef } from 'react';

import { GameClientContext } from './GameClientContext';

function Standings({ showGuess = true, sort = false }) {

  const { standings } = useContext(GameClientContext);

  const guessed = "Guess received!";
  const waiting = "Waiting for guess...";

  if (sort) {
    standings.sort((a, b) => b.score - a.score);
  }

  return (
    <div className="Standings">
      <table>
        <tr>
          <th>Name</th>
          <th>Score</th>
          { showGuess && <th>Guess</th> }
        </tr>
        {standings.map(standing => {
          return (
            <tr>
              <td>{standing.name}</td>
              <td>{standing.score}</td>
              {showGuess && <td>
                {standing.guessed ? guessed : waiting}
              </td>}
            </tr>
          );
        })}
      </table>
    </div>
  );
}

export default Standings;
