const log = require('debug')('iacon-mb:index');
const tools = require('subheaven-tools');

class IaconBroker {
    constructor(db_folder='database') {
        this.db_folder = db_folder;
        this.database = require('subheaven-local-db')(db_folder);
    }

    add = async (collection, payload) => {
        let newone = {
            payload: payload,
            date: new Date(),
            picked: false,
            tryout: 0,
            history: [
                {
                    date: new Date(),
                    name: 'added'
                }
            ]
        }
        let d = await this.database.insert(collection, newone);
        return d._id;
    };

    list = async (collection, query=null) => {
        let tasks = await this.database.find(collection, query);
        return tasks.map(item => item);
    };

    oldest = async (collection) => {
        let tasks = await this.database.find(collection, { picked: false })
        tasks = tasks.sort((a, b) => {
            if (a.date < b.date) {
                return -1;
            }
            if (a.date > b.date) {
                return 1;
            }
            return 0;
        });
        return tasks.length > 0 ? tasks[0] : null;
    };

    delete = async (collection, query) => {
        await this.database.delete(collection, query);
    };

    deleteAll = async (collection) => {
        let tasks = await this.list(collection);
        await tasks.forEachAsync(async item => {
            await this.delete(collection, { _id: item._id })
        });
    };

    pick = async (collection) => {
        let task = await this.oldest(collection);
        if (task !== null) {
            task.picked = true;
            task.history.push({
                date: new Date(),
                name: 'picked'
            });
            await this.database.update(collection, { _id: task._id }, task);
        }
        return task;
    };

    rearm = async (collection, task) => {
        task.picked = false;
        task.history.push({
            date: new Date(),
            name: 'rearm'
        });
        await this.database.update(collection, { _id: task._id }, task);
    };

    clearHistory = async (name) => {
        const h_size = 100;
        let history = await this.database.find(`${name}_hist`);

        while (history.length > h_size) {
            let item = history.shift();
            await this.database.remove(`${name}_hist`, item._id);
        }
    }

    process = async (name, callback, debug=false) => {
        if (debug) {
            this.local_log = (msg) => { console.log(msg); };
        } else {
            this.local_log = (msg) => {};
        }
        try {
            log("")
            log(`Buscando tarefa [${name}]`);
            const task = await this.pick(name);
            if (task !== null) {
                log("Payload:");
                const payload = task.payload;
                log(`    ${JSON.stringify(payload)}`);
                if (callback) {
                    if (task) {
                        this.local_log("");
                        log(`${await tools.now()} Executando processo = ${task._id}`);
                        this.local_log(`${await tools.now()} Executando processo = ${task._id}`);
                        const _oldlog = console.log;
                        const _olderror = console.error;
                        task.log = "";
                        var _log = '';
                        console.log = (msg) => {
                            if (typeof msg === 'object') {
                                _log = `${_log}${JSON.stringify(msg, null, 4)}\n`;
                            } else {
                                _log = `${_log}${msg}\n`;
                            }
                        }
                        try {
                            task.tryout = task.tryout + 1;
                            await callback(payload, task);
                            log(`${await tools.now()} Processo executado com sucesso:`);
                            _oldlog(`${await tools.now()} Processo executado com sucesso:`);
                            log("");
                            log(_log);
                            log("");
                            log("Gravando histórico.");
                            let now = new Date();
                            task.history.push({
                                date: now,
                                name: 'processed',
                                log: _log
                            });
                            await this.database.insert(`${name}_hist`, {
                                log: _log,
                                payload: payload,
                                tryout: task.tryout,
                                date: now,
                                history: task.history
                            });
                            await this.database.delete(name, { _id: task._id });
                            await this.clearHistory(`${name}_hist`);
                            log("Finalizando processo.");
                        } catch (ex) {
                            console.log = _oldlog;
                            console.error = _olderror;
                            log(`${await tools.now()} Erro ao executar processo:`);
                            console.log(`${await tools.now()} Erro ao executar processo:`);

                            let stk = new Error().stack;
                            stk = stk.split('\n').splice(2, stk.split('\n').length);
                            _log = `${_log}\n${ex.toString()}\n${stk.join('\n')}\n`;
                            log(_log);
                            console.log(_log);

                            task.log = _log;
                            let now = new Date();

                            task.history.push({
                                date: now,
                                name: 'error',
                                log: _log
                            });

                            await this.database.update(name, { _id: task._id }, task);
                            await this.rearm(name, task);
                        } finally {
                            console.log = _oldlog;
                            console.error = _olderror;
                            return _log;
                        }
                    };
                } else {
                    log("[ALERT] Não foi informado um callback para a tarefa. Sem isso a tarefa não será fechada.");
                    return '';
                }
            } else {
                return "Nenhuma tarefa encontrada";
            }
        } catch (e) {
            throw e;
        }
    }
}

module.exports = (db_name='database') => {
    return new IaconBroker(db_name);
}