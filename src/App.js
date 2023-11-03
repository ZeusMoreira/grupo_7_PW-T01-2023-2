import RoutesApp from "./routes";
import { ToastContainer } from "react-toastify";
// Importando o arquivo de estilização do componente ToastContainer do react-toastify
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div>
      <ToastContainer autoClose={3000} />
      <RoutesApp/>
    </div>
  )
}

export default App;
