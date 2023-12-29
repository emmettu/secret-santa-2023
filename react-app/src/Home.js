import { useContext, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import { GameClientContext } from './GameClientContext';

function Home() {
  const navigate = useNavigate();

  const [name, setName] = useState("Anonymous");
  const [room, setRoom] = useState("Default");

  const { page, joinRoom } = useContext(GameClientContext);

  const handleSubmit = (event) => {
    event.preventDefault();
    joinRoom(name, room);
  }

  useEffect(() => {
    if (page !== "") {
      navigate(`/${page}`);
    }
  }, [page, navigate]);

  return (
    <div className="Home">
      <form onSubmit={handleSubmit}>
        <label className="NameLabel">
          Name:
          <input type="text" onChange={(e) => setName(e.target.value)}/>
        </label>
        <label className="RoomLabel">
          Room:
          <input type="text" onChange={(e) => setRoom(e.target.value)}/>
        </label>
        <input className="SubmitButton" type="submit" value="Join or create room"/>
      </form>
      <h2>How to play</h2>
      <p>1. Create a new room or join a game with an existing room number.</p>
      <p>2. Read the Wikipedia exerpt for a random country.</p>
      <p>3. Try to guess the country, the closer you are, the higher your score!</p>
    </div>
  );
}

export default Home;
