import { createMemoryRouter, RouterProvider } from "react-router-dom";

import './App.css';
import Home from './Home';
import Guess from './Guess';
import Lobby from './Lobby';
import Final from './Final';
import useGameClient from './GameClient';
import { GameClientContext } from './GameClientContext';
import RoundResults from "./RoundResults";

function App() {
  const client = useGameClient();

  const router = createMemoryRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "lobby",
      element: <Lobby />,
    },
    {
      path: "guess",
      element: <Guess />,
    },
    {
      path: "results",
      element: <RoundResults />,
    },
    {
      path: "final",
      element: <Final />,
    },
  ]);

  return (
    <body className="App">
      <GameClientContext.Provider value={client}>
        <RouterProvider router={router}/>
      </GameClientContext.Provider>
    </body>
  );
}

export default App;
