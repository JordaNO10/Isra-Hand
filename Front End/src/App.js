import MyRouter from "./components/Page layout/MyRouter";
import AccessibilityButton from "./components/Page layout/AccessibilityButton";
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
