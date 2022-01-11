# iacon-mb
Gerenciador de fila de tarefas

Como instalar:
```shell
npm i iacon-mb
```

## Como importar
```js
const mb = require('iacon-mb');
```

## Como adicionar tarefas na fila
```js
await project.add('fila_teste', { message: "Olá SubHeaven 1" });
await project.add('fila_teste', { message: "Olá SubHeaven 2" });
await project.add('fila_teste', { message: "Olá SubHeaven 3" });
```

## Como processar uma tarefa

Ao processar uma tarefa, devemos passar para o iacon-mb uma função que tratará o payload armazenado na fila

```js
let log = await project.process('fila_teste', async (payload, task) => {
    console.log(`Processando a tarefa: ${task._id}`);

    Outros comandos...

    console.log("Tarefa processada");
}, debug=true);

console.log("##################################################################################");
console.log("###  LOG                                                                       ###");
console.log("##################################################################################");
let lines = log.split("\n");
await lines.forEachAsync(async line => {
    console.log(`###  ${line}`);
});
console.log("##################################################################################");
```

Se ocorrer algum erro durante o processamento da tarefa, o iacon-mb adiciona o log com o erro no historico e retorna a tarefa pra fila

```js
let log = await project.process('fila_teste', async (payload, task) => {
    console.log(`Processando a tarefa: ${task._id}`);

    task.oioioi(); // <-- Linha que vai gerar uma exceção

    console.log("Tarefa processada");
}, debug=true);

console.log("##################################################################################");
console.log("###  LOG                                                                       ###");
console.log("##################################################################################");
let lines = log.split("\n");
await lines.forEachAsync(async line => {
    console.log(`###  ${line}`);
});
console.log("##################################################################################");
```

## Outras funções úteis

### Listar todas as tarefas
```js
let tasks = await project.list('fila_teste');
console.log(tasks);
```

Ao executar uma tarefa com sucesso o iacon-mb exclui a tarefa da lista de pendentes e move os dados da tarefa pra uma lista de tarefas finalizadas que possui sufixo ***_hist***:
### Listar tarefas já executadas
```js
let tasks = await project.list('fila_teste_hist');
console.log(tasks);
```

