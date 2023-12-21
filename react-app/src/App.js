import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import logo from './logo.svg';
import './App.css';
import Home from './Home';
import Guess from './Guess';

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/guess",
      element: <Guess />,
    },
  ]);

  return (
      <div className="App">
        <header className="App-header">
          <RouterProvider router={router}>
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <Guess/>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          </RouterProvider>
        </header>
      </div>
  );
}

export default App;
