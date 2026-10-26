import { Navigate, Route, Routes } from "react-router-dom";

import Home from "../pages/Home/Home"
import Eventos from "../pages/Eventos/Eventos"
import DetalhesEvento from "../pages/DetalhesEvento/DetalhesEvento";
import Login from "../pages/Login/Login";
import Usuarios from "../pages/Usuarios/Usuarios";
import TipoUsuario from "../pages/TipoUsuario/TipoUsuario";
import TipoEvento from "../pages/TipoEvento/TipoEvento";

function AppRoutes() {
    return(
        <Routes>
            <Route path="/home" element={<Home/>} />

            <Route path="/eventos" element={<Eventos/>} />

            <Route path="/eventos/:id" element={<DetalhesEvento/>}/>

            <Route path="/login" element={<Login/>}/>

            <Route path="/usuarios" element={<Usuarios/>}/>

            <Route path="/tipos-usuario" element={<TipoUsuario/>}/>

            <Route path="/tipos-evento" element={<TipoEvento/>}/>

            <Route path="*" element={<Navigate to="/home" replace/>}/>
        </Routes>
    )
}

export default AppRoutes;
