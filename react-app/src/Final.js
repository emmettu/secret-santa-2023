import { useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { GameClientContext } from './GameClientContext';

import Standings from './Standings';

import Chat from './Chat';

function Final() {

  const navigate = useNavigate();
  const { page, startGame } = useContext(GameClientContext);

  useEffect(() => {
    if (page !== "") {
      navigate(`/${page}`);
    }
  }, [navigate, page]);

  const handleSubmit = (event) => {
    event.preventDefault();
    startGame();
  }

  return (
    <div className="Final">
      <h2>Final results</h2>
      <Standings showGuess={false} sort={true} />
      <h3>Final remarks</h3>
      <Chat />
      <h3>Play again</h3>
      <div className="StartGame">
        <form onSubmit={handleSubmit}>
          <label>
            <input className="SubmitButton" type="submit" value="Restart game"/>
          </label>
        </form>
      </div>
    </div> 
  );
}

export default Final