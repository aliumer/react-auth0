import React from 'react'
import { Route, Redirect } from "react-router-dom";
import Home from "./Home"
import Profile from "./Profile"
import Nav from "./Nav"
import Auth from "./Auth/Auth";
import Callback from './Callback';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const App = (props) => {
  let history = useHistory();
  console.log("history: ", history);
  const auth = new Auth(history);
  return (
    <>
      <Nav auth={auth} />
      <div className="body">
        <Route path="/" exact render={props => <Home auth={auth} {...props} />} />
        <Route path="/callback" render={props => <Callback auth={auth} {...props} />} />
        <Route path="/profile" render={props => this.auth.isAuthenticated() ? (<Profile auth={auth} {...props} />) : (<Redirect to="/" />)} />
      </div>

    </>

  )
}

export default App
