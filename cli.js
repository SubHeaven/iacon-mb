const project = require('./index.js');
const argParse = require('subheaven-arg');

argParse.init("subheaven-npm-base", "Cumprimenta alguém");
argParse.positional("name", "Nome a ser cumprimentado", { required: false, default: "", sample: "SubHeaven" });
(async() => {
    if (argParse.validate()) {
        //////////////////////////////////////////////////////////////////////////////////////////////
        /// ADICIONAR TAREFA

        // let key = await project.add('fila_teste', { message: "Olá SubHeaven 1" });
        // console.log(key);

        // await project.add('fila_teste', { message: "Olá SubHeaven 2" });
        // await project.add('fila_teste', { message: "Olá SubHeaven 3" });
        // await project.add('fila_teste', { message: "Olá SubHeaven 4" });
        // await project.add('fila_teste', { message: "Olá SubHeaven 5" });

        //////////////////////////////////////////////////////
        /// PEGAR UMA TAREFA PRA PROCESSAR

        // let task = await project.pick('fila_teste');
        // console.log(task);

        //////////////////////////////////////////////////////
        /// PROCESSAR UMA TAREFA

        // let log = await project.process('fila_teste', async (payload, task) => {
        //     console.log("Processando a task:");
        //     console.log(task);
        //     console.log('payload');
        //     console.log(payload);
        //     //task.oioioi();
        //     console.log("Task processada");
        // }, debug=true);

        //////////////////////////////////////////////////////
        /// APAGAR TAREFA

        // let r_remove = await project.remove('fila_teste', 'ktbz1d9w000nn89gmlnisnq6');
        // console.log(r_remove);

        //////////////////////////////////////////////////////
        /// REARMAR TODAS AS TAREFAS

        // let r_remove = await project.rearm('fila_teste');

        //////////////////////////////////////////////////////
        /// FINALIZAR TAREFA

        // // await project.close('fila_teste', 'kt1x2xkh000kck9g5oibqm05');
        // console.log("=============================================================");

        //////////////////////////////////////////////////////
        /// ATUALIZAR TAREFAS

        // let debug = {
        //     tryout: 0,
        //     message: 'Hallo, is SubHeaven er?'
        // };
        // await project.update('fila_teste', 'kuyb17hw0000l09ghgsc9n4p', debug);

        //////////////////////////////////////////////////////
        /// LISTAR TAREFAS

        console.log("//////////////////////////////////////////////////////////////////");
        console.log("///// LISTAR TAREFAS")
        console.log("//////////////////////////////////////////////////////////////////");
        let tasks = await project.list('fila_teste');
        await tasks.forEachAsync(task => {
            console.log("");
            console.log(task);
        });

        //////////////////////////////////////////////////////
        /// LISTAR HISTORICO

        // console.log("//////////////////////////////////////////////////////////////////");
        // console.log("///// LISTAR HISTORICO")
        // console.log("//////////////////////////////////////////////////////////////////");
        // let tasks_hist = await project.list('fila_teste_hist');
        // await tasks_hist.forEachAsync(task => {
        //     console.log("")
        //     console.log(task);
        // });

        //////////////////////////////////////////////////////
        /// APAGAR HISTORICO

        // let r_remove = await project.remove('fila_teste_hist', 'kushjtka000eys9g2dsvzy1a');

        //////////////////////////////////////////////////////
        /// LISTAR HISTORICO

        // let tasks = await project.list('fila_teste_hist');
        // await tasks.forEachAsync(task => {
        //     console.log("")
        //     console.log(task);
        // });


        //////////////////////////////////////////////////////
        /// LISTAR TODOS HISTORICOS

        // let tasks = await project.list('fila_teste_hist');
        // await tasks.forEachAsync(task => {
        //     console.log("")
        //     console.log(task);
        // });
        // await project.remove('fila_teste_hist', 'kt4q29q9000p489g3wmb97xs');
    }
})();