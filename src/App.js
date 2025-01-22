import "./App.css";
import MyRouter from "./components/MyRouter";
import { BrowserRouter } from "react-router-dom";
function App() {
  return (
    <BrowserRouter>
      <MyRouter />
    </BrowserRouter>
  );
}

export default App;
