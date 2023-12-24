import { useEffect, useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";

import { GameClientContext } from './GameClientContext';

function RoundResults() {
  const { getYourResult, getOtherResults, lastAnswer, registerPageCallback } = useContext(GameClientContext);

  const navigate = useNavigate();

  useEffect(() => {
    registerPageCallback((page) => {
      navigate(`/${page}`);
    });
  }, [registerPageCallback, navigate]);

  const result = getYourResult();
  return (
    <div>
      <h2>The answer was: {lastAnswer}</h2>
      <h3>You guessed: <strong>{result.guess}</strong> for a score of <strong>{result.score}</strong></h3>

      {getOtherResults().map(r => {
        return <p>{r.name} guessed: {r.guess} for a score of {r.score}</p>
      })}
    </div>
  );
}

export default RoundResults;