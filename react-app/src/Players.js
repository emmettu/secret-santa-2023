import { useEffect, useState, useContext } from 'react';

import { GameClientContext } from './GameClientContext';

function Players() {

  const [clients, setClients] = useState([]);
  const { registerHintCallback, registerClientCallback, registerCorrectCallback } = useContext(GameClientContext);

  useEffect(() => {
    registerClientCallback((clients) => setClients(clients));
  }, [registerClientCallback, setClients]);

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
