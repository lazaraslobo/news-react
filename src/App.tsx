import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/routes';
import {NavBarComponent} from "./components/nav-bar";
import "./resources/scss/app.scss"

function App() {

  return (
      <>
        <NavBarComponent />
          <div className="d-flex flex-wrap w-100 p-0">
             <div className="container-fluid">
                <RouterProvider router={router} />
            </div>
          </div>
      </>
  );
}

export default App;
