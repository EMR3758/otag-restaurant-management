import {BrowserRouter,Routes,Route} from "react-router-dom";

import Login from "./pages/Login";
import Dasboard from "./pages/Dashboard";

function App() {
  return (
     <BrowserRouter>
       <Routes>
         <Route path="/login" element={<Login />}/>
         <Route path="/dashboard" element={<Dasboard />}/>

       </Routes>
     </BrowserRouter>
  )
}

export default App;