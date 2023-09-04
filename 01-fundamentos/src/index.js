const express = require('express');

const app = express();

// Isso é para informar que as requisições que passarem algo no body será no formato json
app.use(express.json());

/**
 * GET - Buscar uma info dentro do servidor
 * POST - Inserir/criar uma info no servidor
 * PUT - Atualizar uma info no servidor
 * PATCH - Atualizar uma info específica /id
 * DELETE - Deletar uma info no servidor
 */

/**
 * Tipos de parâmetros
 * Route Params => identificar um recurso para editar/deletar/buscar
 * Query Params => Exemplo de uso: paginação, filtro de busca
 * Body Params => São os objetos que serão passados numa requisição para Criação/Atualização
 */
app.get("/", (request, response)=>{
    // return response.send('<h1>Hello, World!</h1>');
    const {teste} = request.query;
    return response.json({message: `Hello World! ${teste}`});
});

app.get("/courses", (request, response) => {
    return response.json(["Curso 1", "Curso 2", "Curso 3"]);
});

app.post("/courses", (request, response)=>{
    return response.json(["Curso 1", "Curso 2", "Curso 3", "Curso 4"]);
});

app.put("/courses/:id", (request, response)=>{
    const params = request.params;
    console.log(params);
    return response.json(["Curso 6", "Curso 2", "Curso 3", "Curso 4", `Curso ${params['id']}`]);
});

app.patch("/courses/:id", (request, response)=>{
    return response.json(["Curso 5", "Curso 2", "Curso 3", "Curso 4"]);
});

app.delete("/courses/:id", (request, response)=>{
    return response.json(["Curso 2", "Curso 3", "Curso 4"]);
});

app.listen(8888);
