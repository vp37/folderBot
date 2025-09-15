import Router from "./router/Router"
import { ThemeProvider } from "./context/Themecontext";

function App() {
  return (
     <ThemeProvider>
      <Router/>
     </ThemeProvider>
    
  );
}

export default App;
