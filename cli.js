const project = require('./index.js');
const argParse = require('subheaven-arg');
const tools = require('subheaven-tools');

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
        //     task.oioioi();
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

        // console.log("//////////////////////////////////////////////////////////////////");
        // console.log("///// LISTAR TAREFAS")
        // console.log("//////////////////////////////////////////////////////////////////");
        // let tasks = await project.list('fila_teste');
        // await tasks.forEachAsync(task => {
        //     console.log("");
        //     console.log(task);
        // });

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

        // console.log("//////////////////////////////////////////////////////////////////");
        // console.log("///// APAGAR REGISTRO")
        // console.log("//////////////////////////////////////////////////////////////////");
        // // let r_remove = await project.remove('config', 'kv2ly6kw0007ow9gyv1rovhf');
        // let r_remove = await project.removeAll('config');

        //////////////////////////////////////////////////////
        /// LISTAR HISTORICO

        // let tasks = await project.list('fila_teste_hist');
        // await tasks.forEachAsync(task => {
        //     console.log("")
        //     console.log(task);
        // });


        // console.log("//////////////////////////////////////////////////////////////////");
        // console.log("///// DETALHE LISTA")
        // console.log("//////////////////////////////////////////////////////////////////");
        // let tasks = await project.findAll('config');
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

        //////////////////////////////////////////////////////
        /// LISTAR FILAS

        // await project.clearHistory('fila_teste');

        console.log("//////////////////////////////////////////////////////////////////");
        console.log("///// LISTAR FILAS")
        console.log("//////////////////////////////////////////////////////////////////");
        let queues = await project.queues(true);
        await queues.forEachAsync(item => {
            console.log(item);
        });
        console.log("");

        // console.log("//////////////////////////////////////////////////////////////////");
        // console.log("///// LISTAR TODAS AS FILAS")
        // console.log("//////////////////////////////////////////////////////////////////");
        // let allQueues = await project.queues(true);
        // await allQueues.forEachAsync(item => {
        //     console.log(item);
        // });
        // console.log("");

        // console.log("//////////////////////////////////////////////////////////////////");
        // console.log("///// LISTAR FILAS COM RESUMO")
        // console.log("//////////////////////////////////////////////////////////////////");
        // let detailQueues = await project.queues(false, true);
        // await tools.debug(JSON.stringify(detailQueues, null, 4));

        // console.log("//////////////////////////////////////////////////////////////////");
        // console.log("///// SETAR CONFIGURACAO")
        // console.log("//////////////////////////////////////////////////////////////////");
        // await project.setConfig('email_teste', {
        //     url: 'smtplw.com.br',
        //     port: 587,
        //     acc: 'ribeirocontabilidade',
        //     pass: 'CzFKLRfs6097',
        //     email: 'notificacaoiacon@somacontabilidades.com.br',
        //     imap: 'mail.exchange.locaweb.com.br',
        //     imap_port: '993',
        //     email_pass: 'soma@202010',
        //     imap_folder: '"/Mensagens enviadas"'
        // });

        console.log("//////////////////////////////////////////////////////////////////");
        console.log("///// BUSCAR CONFIGURACAO")
        console.log("//////////////////////////////////////////////////////////////////");
        let config = await project.getConfig('email_teste');
        tools.debug(config);
    }
})();