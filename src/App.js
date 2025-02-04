import "./App.css";
import MyRouter from "./components/MyRouter";
import AccessibilityButton from "./components/AccessibilityButton";
import { BrowserRouter } from "react-router-dom";
function App() {
  return (
    <BrowserRouter>
      <MyRouter />
    <AccessibilityButton />
    </BrowserRouter>
  );
}

export default App;
