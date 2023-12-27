import { createMemoryRouter, RouterProvider } from "react-router-dom";

import './App.css';
import Home from './Home';
import Guess from './Guess';
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
      path: "guess",
      element: <Guess />,
    },
    {
      path: "results",
      element: <RoundResults />,
    },
  ]);

  return (
      <div className="App">
        <header className="App-header">
          <h1>WikiCountryGuessr</h1>
        </header>
        <body>
          <GameClientContext.Provider value={client}>
            <RouterProvider router={router}/>
          </GameClientContext.Provider>
        </body>
      </div>
  );
}

export default App;
