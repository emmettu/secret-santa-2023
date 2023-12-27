import { useEffect, useState, useContext } from 'react';

import { GameClientContext } from './GameClientContext';

function Players() {

  const [clients, setClients] = useState([]);
  const { registerHintCallback, registerCorrectCallback } = useContext(GameClientContext);

  return (
    <div className="Players">
      {clients.map((playerName) => {
        return <div>
          { playerName }
        </div>
      })}
    </div>
  );
}

export default Players;
