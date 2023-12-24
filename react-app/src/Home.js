import { useContext, useState } from 'react';
import { useNavigate } from "react-router-dom";

import { GameClientContext } from './GameClientContext';

function Home() {
  const navigate = useNavigate();

  const [name, setName] = useState("Anonymous");

  const { joinRoom } = useContext(GameClientContext);

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate("/guess");
    joinRoom(name);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input type="text" onChange={(e) => setName(e.target.value)}/>
      </label>
      <input type="submit" value="Join"/>
    </form>
  );
}

export default Home;
