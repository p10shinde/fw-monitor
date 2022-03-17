import logo from "./logo.svg";
import "./App.css";
import Dashboard from "./Components/Dashboard";
import {
  ReferenceDataContext,
  ReferenceDataContextProvider,
} from "./Context/ReferenceDataContext";
import { useContext } from "react";

function App() {
  const { accDetails } = useContext(ReferenceDataContext);

  return (
    <div className="App">
      <ReferenceDataContextProvider>
        <Dashboard />
      </ReferenceDataContextProvider>
    </div>
  );
}

export default App;
