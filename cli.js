const project = require('./index.js');
const argParse = require('subheaven-arg');
const tools = require('subheaven-tools');

argParse.init("subheaven-npm-base", "Cumprimenta alguém");
argParse.positional("name", "Nome a ser cumprimentado", { required: false, default: "", sample: "SubHeaven" });
(async() => {
    if (argParse.validate()) {
        // const database = require('subheaven-local-db')('fila_teste');
        // let dataset = await database.find('fila_teste', {});
        // await tools.debug(dataset);
        // let dataset2 = await database.find('fila_teste', { _id: dataset[0]._id });
        // await tools.debug(dataset2);
        // await tools.exit();
        //////////////////////////////////////////////////////
        /// INSERIR UM REGISTRO

        // let teste = {
        //     payload: '',
        //     date: new Date(),
        //     picked: false,
        //     tryout: 0
        // }
        // teste.payload = { message: "Olá SubHeaven 8" };

        // let inserido = await database.insert('fila_teste', teste);
        // await tools.debug(inserido);

        // let dataset = await database.find('fila_teste', {});
        // await tools.debug(dataset);

        //////////////////////////////////////////////////////
        /// CONSULTAR TODOS OS REGISTROS

        // let dataset = await database.find('fila_teste', {});
        // await tools.debug(dataset);

        //////////////////////////////////////////////////////
        /// CONSULTAR REGISTRO ESPECÍFICO

        // let dataset = await database.find('fila_teste', { '_id': 4 });
        // tools.debug(dataset);

        //////////////////////////////////////////////////////
        /// EXCLUIR REGISTRO

        // await database.delete('fila_teste', { '_id': 3 });

        // let dataset = await database.find('fila_teste', { '_id': { '$gt': 0 } });
        // await tools.debug(dataset);

        //////////////////////////////////////////////////////
        /// ALTERAR REGISTRO

        // await database.update('fila_teste', { _id: 4 }, { picked: false, tryout: 1, new: true });

        // let dataset = await database.find('fila_teste', { '_id': { '$gt': 0 } });
        // tools.debug(dataset);

        //////////////////////////////////////////////////////
        //////////////////////////////////////////////////////

        //////////////////////////////////////////////////////
        /// ADICIONAR VARIAS TAREFAS

        // await project.add('fila_teste', { message: "Olá SubHeaven 1" });
        // await project.add('fila_teste', { message: "Olá SubHeaven 2" });
        // await project.add('fila_teste', { message: "Olá SubHeaven 3" });
        // await project.add('fila_teste', { message: "Olá SubHeaven 4" });
        // await project.add('fila_teste', { message: "Olá SubHeaven 5" });
        // await project.add('fila_teste', { message: "Olá SubHeaven 6" });
        // await project.add('fila_teste', { message: "Olá SubHeaven 7" });
        // await project.add('fila_teste', { message: "Olá SubHeaven 8" });
        // await project.add('fila_teste', { message: "Olá SubHeaven 9" });
        // await project.add('fila_teste', { message: "Olá SubHeaven 10" });

        ////////////////////////////////////////////////////
        // LISTAR TAREFAS
        const listarTarefas = async () => {
            console.log("//////////////////////////////////////////////////////////////////");
            console.log("///// LISTAR TAREFAS")
            console.log("//////////////////////////////////////////////////////////////////");
            let tasks = await project.list('fila_teste');
            await tools.debug(tasks);
        }
        await listarTarefas();

        ////////////////////////////////////////////////////
        // LISTAR PROCESSADAS
        const listarProcessadas = async () => {
            console.log("//////////////////////////////////////////////////////////////////");
            console.log("///// LISTAR PROCESSADAS")
            console.log("//////////////////////////////////////////////////////////////////");
            let tasks = await project.list('fila_teste_hist');
            await tools.debug(tasks);
        }
        await listarProcessadas();

        //////////////////////////////////////////////////////
        /// CONSULTAR TAREFA LIVRE MAIS ANTIGA

        // console.log("//////////////////////////////////////////////////////////////////");
        // console.log("///// CONSULTAR TAREFA LIVRE MAIS ANTIGA")
        // console.log("//////////////////////////////////////////////////////////////////");
        // let task = await project.oldest('fila_teste');
        // await tools.debug(task);

        //////////////////////////////////////////////////////
        /// EXCLUIR TODAS AS TAREFAS

        // console.log("//////////////////////////////////////////////////////////////////");
        // console.log("///// EXCLUIR TODAS AS TAREFAS")
        // console.log("//////////////////////////////////////////////////////////////////");
        // await project.deleteAll('fila_teste');

        //////////////////////////////////////////////////////
        /// PEGAR UMA TAREFA PRA PROCESSAR

        // let task = await project.pick('fila_teste');
        // console.log(task);

        //////////////////////////////////////////////////////
        /// VOLTAR UMA TAREFA PARA A LISTA DE PROCESSAMENTO

        // console.log("//////////////////////////////////////////////////////////////////");
        // console.log("///// VOLTAR UMA TAREFA PARA A LISTA DE PROCESSAMENTO")
        // console.log("//////////////////////////////////////////////////////////////////");
        // let tasks = await project.list('fila_teste', { picked: true });
        // tools.debug(tasks)
        // if (tasks.length > 0) {
        //     // console.log(tasks[0]);
        //     await project.rearm('fila_teste', tasks[0]);
        // }

        //////////////////////////////////////////////////////
        /// PROCESSAR UMA TAREFA
        // let log = await project.process('fila_teste', async (payload, task) => {
        //     console.log(`Processando a task: ${task._id}`);
        //     console.log('payload:');
        //     console.log(payload);
        //     // task.oioioi();
        //     console.log("Task processada");
        // }, debug=true);
        // console.log("♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫");
        // console.log("♫♫♫  LOG                                                                       ♫♫♫");
        // console.log("♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫");
        // let lines = log.split("\n");
        // await lines.forEachAsync(async line => {
        //     console.log(`♫♫♫  ${line}`);
        // });
        // console.log("♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫♫");

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

        // console.log("//////////////////////////////////////////////////////////////////");
        // console.log("///// LISTAR FILAS")
        // console.log("//////////////////////////////////////////////////////////////////");
        // let queues = await project.queues(true);
        // await queues.forEachAsync(item => {
        //     console.log(item);
        // });
        // console.log("");

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

        // let setarConfiguracao = async () => {
        //     console.log("//////////////////////////////////////////////////////////////////");
        //     console.log("///// SETAR CONFIGURACAO")
        //     console.log("//////////////////////////////////////////////////////////////////");
        //     await project.setConfig('email_teste', {
        //         url: '',
        //         port: ,
        //         acc: '',
        //         pass: '',
        //         email: '',
        //         imap: '',
        //         imap_port: '',
        //         email_pass: '',
        //         imap_folder: '"/Mensagens enviadas"'
        //     });
        // }

        // let removerConfiguracao = async () => {
        //     console.log("//////////////////////////////////////////////////////////////////");
        //     console.log("///// APAGAR CONFIGURACAO")
        //     console.log("//////////////////////////////////////////////////////////////////");
        //     let config = await project.removeConfig('email_teste');
        //     tools.debug(config);
        // }

        // let mostrarConfiguracao = async () => {
        //     console.log("//////////////////////////////////////////////////////////////////");
        //     console.log("///// BUSCAR CONFIGURACAO")
        //     console.log("//////////////////////////////////////////////////////////////////");
        //     let config = await project.getConfig('email_teste');
        //     tools.debug(config);
        // }

        // await setarConfiguracao();
        // await removerConfiguracao();
        // await mostrarConfiguracao();
        // await addTarefa();

        ////////////////////////////////////////////////////
        // LISTAR TAREFAS
        // const listarTarefas2 = async () => {
        //     console.log("//////////////////////////////////////////////////////////////////");
        //     console.log("///// LISTAR TAREFAS")
        //     console.log("//////////////////////////////////////////////////////////////////");
        //     let tasks = await project.list('fila_teste');
        //     await tools.debug(tasks);
        // }
        // await listarTarefas2();
    }
})();