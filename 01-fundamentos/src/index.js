const express = require('express');

const app = express();

app.get("/", (request, response)=>{
    // return response.send('<h1>Hello, World!</h1>');
    return response.json({message: "Hello World!"});
});

app.listen(8888);