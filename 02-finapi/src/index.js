const express = require('express');
/**
 * v4 vai gerar um id aleatório
 * para renomear/apelidar nosso recurso basta utilizar dois pontos (:)
 * Exemplo: const { v4 : uuidv4 } = require('uuid')
 */
const { v4: uuidv4 } = require('uuid'); 

const app = express();

//Os retornos serão em JSON
app.use(express.json());

/**
 * customers está abstraindo o banco de dados (por enquanto)
 */
const customers = [];

// Middleware
function verifyIfExistsAccountCPF(request, response, next){
    const { token } = request.headers;

    const customer = customers.find((customer) => customer.cpf === token);

    if(!customer) {
        return response.status(400).json({ error: `Customer not found! Token: ${token}.`});
    }

    request.customer = customer;

    return next();
}

// Consulta saldo
function getBalance(statement){
    const balance = statement.reduce((acc, operation) => {
        if(operation.type === 'credit'){
            return acc + operation.amount;
        } else {
            return acc - operation.amount;
        }
    }, 0);
    return balance;
}

/**
 * cpf - string
 * name - string
 * id - uuid
 * statement - array
 */
app.post("/account", (request, response) => {
    const { cpf, name } = request.body;
    
    const customerAlreadyExists = customers.some((customer) => customer.cpf === cpf);

    if(customerAlreadyExists){
        return response.status(400).json({error: 'Customer already exists!'});
    } 
    
    customers.push({cpf, name, id: uuidv4(), statement:[]});

    // StatusCode 201 para sucesso na criação de dados no servidor
    return response.status(201).send();
});

// Consultar extrato
app.get("/statement/", verifyIfExistsAccountCPF, (request, response) => {
    const { customer } = request;
    return response.json(customer.statement);
})

// Efetuar depósito
app.post('/deposit', verifyIfExistsAccountCPF, (request, response) => {
    const { description, amount } = request.body;

    const { customer } = request;

    const statementOperation = {
        description,
        amount,
        created_at: new Date(),
        type: 'credit'
    }

    customer.statement.push(statementOperation);

    return response.status(201).send();
});

// Efetuar saque
app.post('/withdraw', verifyIfExistsAccountCPF, (request, response) => {
    const { amount } = request.body;
    const { customer } = request;

    const balance = getBalance(customer.statement);

    if(balance  < amount){
        return response.status(400).json({ error: 'Insufficient funds!'});
    }

    const statementOperation = {
        amount, 
        created_at: new Date(),
        type: 'debit'
    }

    customer.statement.push(statementOperation);

    return response.status(201).send();
});

app.listen(8888);