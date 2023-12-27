import { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { TypeAnimation } from 'react-type-animation';

import { GameClientContext } from './GameClientContext';

function Standings() {

  const { standings } = useContext(GameClientContext);

  // const useState(standings);

  const sequence = useRef([]);

  // useEffect(() => {
  //   sequence.current.push(standings.guessed ? "Guess received!" : "Waiting for guess");
  //   console.log(sequence.current);
  // }, [standings]);

  const guessed = "Guess received!";
  const waiting = "Waiting for guess...";

  const getAnimation = (standing) => {
    const seq = standing.guessed ? [waiting, guessed] : [waiting];
    console.log("RERENDERED WITH: " + seq);
    return (
      <TypeAnimation
        sequence={seq}
        cursor={true}
        preRenderFirstString={true}
      />);
  }

  return (
    <div className="Standings">
      <table>
        <tr>
          <th>Name</th>
          <th>Score</th>
          <th>Guess</th>
        </tr>
        {standings.map(standing => {
          return (
            <tr>
              <td>{standing.name}</td>
              <td>{standing.score}</td>
              <td>
                {standing.guessed ? guessed : waiting}
              </td>
            </tr>
          );
        })}
      </table>
    </div>
  );
}

export default Standings;
