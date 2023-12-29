import { useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { GameClientContext } from './GameClientContext';
import { TypeAnimation } from 'react-type-animation';

import Chat from './Chat';

function Lobby() {

  const navigate = useNavigate();
  const { standings, page, room, startGame } = useContext(GameClientContext);

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
    <div className="Lobby">
      <h2>"{room}" Lobby <span/>
        <TypeAnimation
          sequence={["waiting for players...", 1000, "should start any day now...", 1000]}
          preRenderFirstString={true}
          speed={40}
          cursor={true}
          repeat={Infinity}
        />
      </h2>

      <h3>Players</h3>
      {standings.map(s => {
        return (
          <p>{s.name}</p>
        );
      })}
      <Chat />
      <h3>Once you have enough players</h3>
      <div className="StartGame">
        <form onSubmit={handleSubmit}>
          <label>
            <input className="SubmitButton" type="submit" value="Start game"/>
          </label>
        </form>
      </div>
    </div> 
  );
}

export default Lobby