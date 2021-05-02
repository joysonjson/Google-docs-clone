import logo from "./logo.svg";
import "./App.css";
import TextEditor from "./component/TextEditor";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <Redirect
            to={`/documents/${Math.random().toString(36).substring(7)}`}
          />
        </Route>

        <Route path="/documents/:id" exact>
          <TextEditor />
        </Route>
      </Switch>
      <div className="App">
        <TextEditor />
      </div>
    </Router>
  );
}

export default App;
