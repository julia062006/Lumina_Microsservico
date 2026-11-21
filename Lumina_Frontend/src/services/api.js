const API = "/api";

async function tratarResposta(resposta) {
    let data;

    try {
        data = await resposta.json();
    } catch {
        data = { mensagem: "Erro inesperado" };
    }

    return {
        ok: resposta.ok,
        status: resposta.status,
        data
    };
}


function getHeaders() {
    const token = localStorage.getItem("token");
    const headers = {
        "Content-Type": "application/json"
    };

    if (token) {
        headers.Authorization = "Bearer " + token;
    }

    return headers;
}

function getHeadersFormData() {
    const token = localStorage.getItem("token");
    const headers = {};

    if (token) {
        headers.Authorization = "Bearer " + token;
    }

    return headers;
}

export async function getUsuarios() {
    const resposta = await fetch(API + "/usuarios", { headers: getHeaders() });
    return tratarResposta(resposta);
}

export async function criarUsuario(dados) {
    const resposta = await fetch(API + "/usuarios", {
        method: "POST",
        headers: getHeadersFormData(),
        body: dados
    });

    return tratarResposta(resposta);
}

export async function loginUsuario(dados) {
    const resposta = await fetch(API + "/entrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
    });

    return tratarResposta(resposta);
}

export async function atualizarUsuarioComFoto(id, dados) {
    const resposta = await fetch(API + "/usuarios/" + id, {
        method: "PUT",
        headers: getHeadersFormData(),
        body: dados
    });

    return tratarResposta(resposta);
}

export async function excluirUsuario(id) {
    const resposta = await fetch(API + "/usuarios/" + id, {
        method: "DELETE",
        headers: getHeaders()
    });

    return tratarResposta(resposta);
}

export async function getPerfil() {
    const resposta = await fetch(API + "/perfil", {
        headers: getHeaders()
    });

    return tratarResposta(resposta);
}

export async function getAutores() {
    const resposta = await fetch(API + "/autores");
    return tratarResposta(resposta);
}

export async function criarAutor(dados) {
    const resposta = await fetch(API + "/autores", {
        method: "POST",
        headers: getHeadersFormData(),
        body: dados
    });

    return tratarResposta(resposta);
}

export async function editarAutor(id, dados) {
    const resposta = await fetch(API + "/autores/" + id, {
        method: "PUT",
        headers: getHeadersFormData(),
        body: dados
    });

    return tratarResposta(resposta);
}

export async function deletarAutores(id) {
    const resposta = await fetch(API + "/autores/" + id, {
        method: "DELETE",
        headers: getHeaders()
    });

    return tratarResposta(resposta);
}

export async function getCategorias() {
    const resposta = await fetch(API + "/categorias");
    return tratarResposta(resposta);
}

export async function getCategoriasDestaque() {
    const resposta = await fetch(API + "/categorias/destaque");
    return tratarResposta(resposta);
}

export async function criarCategoria(dados) {
    const resposta = await fetch(API + "/categorias", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(dados)
    });

    return tratarResposta(resposta);
}

export async function editarCategoria(id, dados) {
    const resposta = await fetch(API + "/categorias/" + id, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(dados)
    });

    return tratarResposta(resposta);
}

export async function deletarCategorias(id) {
    const resposta = await fetch(API + "/categorias/" + id, {
        method: "DELETE",
        headers: getHeaders()
    });

    return tratarResposta(resposta);
}

export async function getLivros() {
    const resposta = await fetch(API + "/livros");
    return tratarResposta(resposta);
}

export async function getLivrosDestaque() {
    const resposta = await fetch(API + "/livros/destaque");
    return tratarResposta(resposta);
}

export async function getLivrosPorAutor(id) {
    const resposta = await fetch(API + "/autores/" + id + "/livros");
    return tratarResposta(resposta);
}

export async function criarLivro(dados) {
    const resposta = await fetch(API + "/livros", {
        method: "POST",
        headers: getHeadersFormData(),
        body: dados
    });

    return tratarResposta(resposta);
}

export async function editarLivro(id, dados) {
    const resposta = await fetch(API + "/livros/" + id, {
        method: "PUT",
        headers: getHeadersFormData(),
        body: dados
    });

    return tratarResposta(resposta);
}

export async function deletarLivro(id) {
    const resposta = await fetch(API + "/livros/" + id, {
        method: "DELETE",
        headers: getHeaders()
    });

    return tratarResposta(resposta);
}


export async function getEditoras() {
    const resposta = await fetch(API + "/editoras");
    return tratarResposta(resposta);
}

export async function criarEditora(dados) {
    const resposta = await fetch(API + "/editoras", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(dados)
    });
    return tratarResposta(resposta);
}

export async function editarEditora(id, dados) {
    const resposta = await fetch(API + "/editoras/" + id, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(dados)
    });
    return tratarResposta(resposta);
}

export async function deletarEditora(id) {
    const resposta = await fetch(API + "/editoras/" + id, {
        method: "DELETE",
        headers: getHeaders()
    });
    return tratarResposta(resposta);
}



export async function getColecoes() {
    const resposta = await fetch(API + "/colecoes");
    return tratarResposta(resposta);
}

export async function criarColecao(dados) {
    const resposta = await fetch(API + "/colecoes", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(dados)
    });
    return tratarResposta(resposta);
}

export async function editarColecao(id, dados) {
    const resposta = await fetch(API + "/colecoes/" + id, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(dados)
    });
    return tratarResposta(resposta);
}

export async function deletarColecao(id) {
    const resposta = await fetch(API + "/colecoes/" + id, {
        method: "DELETE",
        headers: getHeaders()
    });
    return tratarResposta(resposta);
}