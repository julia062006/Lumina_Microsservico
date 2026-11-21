import { Route, Routes } from "react-router-dom";
import "./App.css";
import Menu from "./componentes/Menu";
import Rodape from "./componentes/Rodape";
import CadastroUsuario from "./paginas/CadastroUsuario";
import CadastrarAutor from "./paginas/painel/autores/CadastroAutor";
import Entrar from "./paginas/Entrar";
import CadastrarLivro from "./paginas/painel/livros/CadastroLivro";
import Biblioteca from "./paginas/Biblioteca";
import Inicio from "./paginas/Inicio";
import RotaProtegida from "./rotas/RotaProtegida";
import Autores from "./paginas/Autores";
import Perfil from "./paginas/Perfil";
import EditarPerfil from "./paginas/EditarPerfil";
import Painel from "./paginas/painel/Painel";
import ListarLivros from "./paginas/painel/livros/ListarLivros";
import ListarAutores from "./paginas/painel/autores/ListarAutores";
import ListarUsuarios from "./paginas/painel/usuarios/ListarUsuarios";
import ListarCategorias from "./paginas/painel/categorias/ListarCategorias";
import CadastrarCategoria from "./paginas/painel/categorias/CadastroCategoria";
import EditarAutor from "./paginas/painel/autores/EditarAutor";
import Categorias from "./paginas/Categorias";
import EditarLivro from "./paginas/painel/livros/EditarLivro";
import EditarCategoria from "./paginas/painel/categorias/EditarCategoria";
import ListarEditoras from "./paginas/painel/editoras/ListarEditoras";
import CadastroEditoras from "./paginas/painel/editoras/CadastroEditoras";
import EditarEditoras from "./paginas/painel/editoras/EditarEditoras";
import ListarColecao from "./paginas/painel/colecao/ListarColecao";
import CadastroColecao from "./paginas/painel/colecao/CadastroColecao";
import EditarColecao from "./paginas/painel/colecao/EditarColecao";
import RotaAdmin from "./rotas/RotaAdmin";

function App() {

  return (
    <div>
      <Menu />

      <main>
        <Routes>
          <Route path="/" element={<Inicio />}></Route>
          <Route path="/cadastroUsuario" element={<CadastroUsuario />} />
          <Route path="/entrar" element={<Entrar />} />
          <Route path="/biblioteca" element={<Biblioteca />} />
          <Route path="/perfil" element={<RotaProtegida><Perfil /></RotaProtegida>} />
          <Route path="/editarPerfil" element={<RotaProtegida><EditarPerfil /></RotaProtegida>} />
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/autores" element={<Autores />} />
          <Route path="/livros/autor/:id" element={<Biblioteca />} />
          <Route path="/categorias" element={<Categorias />} />

          <Route path="/painel" element={<RotaAdmin><Painel /></RotaAdmin>} />

          <Route path="/painel/usuarios" element={<RotaAdmin><ListarUsuarios /></RotaAdmin>} />

          <Route path="/painel/livros" element={<RotaAdmin><ListarLivros /></RotaAdmin>} />
          <Route path="/painel/cadastroLivro" element={<RotaAdmin><CadastrarLivro /></RotaAdmin>} />
          <Route path="/painel/editarLivro/:id" element={<RotaAdmin><EditarLivro /></RotaAdmin>} />

          <Route path="/painel/autores" element={<RotaAdmin><ListarAutores /></RotaAdmin>} />
          <Route path="/painel/cadastroAutor" element={<RotaAdmin><CadastrarAutor /></RotaAdmin>} />
          <Route path="/painel/editarAutor/:id" element={<RotaAdmin><EditarAutor /></RotaAdmin>} />


          <Route path="/painel/categorias" element={<RotaAdmin><ListarCategorias /></RotaAdmin>} />
          <Route path="/painel/cadastroCategoria" element={<RotaAdmin><CadastrarCategoria /></RotaAdmin>} />
          <Route path="/painel/editarCategoria/:id" element={<RotaAdmin><EditarCategoria /></RotaAdmin>} />

          <Route path="/painel/editoras" element={<RotaAdmin><ListarEditoras /></RotaAdmin>} />
          <Route path="/painel/cadastroEditora" element={<RotaAdmin><CadastroEditoras /></RotaAdmin>} />
          <Route path="/painel/editarEditora/:id" element={<RotaAdmin><EditarEditoras /></RotaAdmin>} />

          <Route path="/painel/colecao" element={<RotaAdmin><ListarColecao /></RotaAdmin>} />
          <Route path="/painel/cadastroColecao" element={<RotaAdmin><CadastroColecao /></RotaAdmin>} />
          <Route path="/painel/editarColecao/:id" element={<RotaAdmin><EditarColecao /></RotaAdmin>} />

        </Routes>
      </main>

      <Rodape />
    </div>
  );
}

export default App;