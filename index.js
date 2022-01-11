const database = require('subheaven-local-db')('fila_teste');
const env = require('subheaven-env');
const log = require('debug')('iacon-mb:index');
const tools = require('subheaven-tools');

env.addParams([
    { name: 'DBPATH', description: 'Caminho da pasta do banco de dados', required: true, sample: './db' },
    { name: 'DBNAME', description: 'Nome do banco de dados', required: true, sample: 'iacon' }
]);

exports.add = async (collection, payload) => {
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
    let d = await database.insert(collection, newone);
    return d._id;
};

exports.list = async (collection, query=null) => {
    let tasks = await database.find(collection, query);
    return tasks.map(item => item);
};

exports.oldest = async (collection) => {
    let tasks = await database.find(collection, { picked: false })
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

exports.delete = async (collection, query) => {
    await database.delete(collection, query);
};

exports.deleteAll = async (collection) => {
    let tasks = await exports.list(collection);
    await tasks.forEachAsync(async item => {
        await exports.delete(collection, { _id: item._id })
    });
};

exports.pick = async (collection) => {
    let task = await exports.oldest(collection);
    if (task !== null) {
        task.picked = true;
        task.history.push({
            date: new Date(),
            name: 'picked'
        });
        await database.update(collection, { _id: task._id }, task);
    }
    return task;
};

exports.rearm = async (collection, task) => {
    task.picked = false;
    task.history.push({
        date: new Date(),
        name: 'rearm'
    });
    await database.update(collection, { _id: task._id }, task);
};

exports.close = (name, id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let process = async () => {
                exports.db.ready(() => {
                    exports.db.query(name)
                    .filter('_id', '==', id)
                    .get(async snapshots => {
                        let now = new Date();
                        let tasks = snapshots.getValues();
                        task = tasks.length > 0 ? tasks[0] : null;
                        if (task) {
                            task.history.push({
                                date: now,
                                name: 'closed'
                            });
                            await database.database(name, task._id);
                        };
                        resolve(task)
                    });
                });
            }
            if (exports.db) {
                await process()
            } else {
                setTimeout(process, 10);
            }
        } catch (e) {
            reject(e);
        }
    });
}

exports.queueDetail = async (name) => {
    let detail = {
        name: name,
        erros: [],
        pendentes: [],
        history: []
    };
    let tasks = await database.find(name);
    await tasks.forEachAsync(item => {
        if (item.tryout > 0) {
            detail.erros.push({
                _id: item._id,
                payload: item.payload,
                log: item.log,
                history: item.history
            });
        } else {
            detail.pendentes.push({
                _id: item._id,
                payload: item.payload,
                log: item.log,
                history: item.history
            });
        }
    });
    detail.history = await database.find(`${name}_hist`);
    detail.history = JSON.parse(JSON.stringify(detail.history));
    return detail;
}

exports.queues = (all = false, details = false) => {
    let mountDetails = async (refs) => {
        await refs.forEachAsync(async (item, index) => {
            refs[index] = await exports.queueDetail(item);
        });
        return refs;
    }
    return new Promise(async (resolve, reject) => {
        try {
            let process = async () => {
                exports.db.ready(() => {
                    exports.db.query('')
                    .get(async snapshot => {
                        let refs = JSON.parse(JSON.stringify(snapshot.map(item => item.ref.path), null, 4));
                        refs = refs.filter(item => item !== 'config');
                        if (!all) refs = refs.filter(item => item.indexOf('_hist') !== (item.length - 5));
                        if (details) refs = await mountDetails(refs);
                        resolve(refs);
                    });
                });
            }
            if (exports.db) {
                await process()
            } else {
                setTimeout(process, 10);
            }
        } catch (e) {
            reject(e);
        }
    });
}

exports.clearHistory = async (name) => {
    const h_size = 100;
    let history = await database.find(`${name}_hist`);

    while (history.length > h_size) {
        let item = history.shift();
        await database.remove(`${name}_hist`, item._id);
    }
}

exports.setConfig = async (name, config) => {
    await exports.removeConfig(name);
    await database.insert(`config`, config);
    return 0
}

exports.getConfig = async (name) => {
    let teste = await database.find(`config`);
    return teste.length > 0 ? teste[0] : null;
}

exports.removeConfig = (name) => {
    return new Promise(async (resolve, reject) => {
        try {
            let process = async () => {
                exports.db.ready(() => {
                    exports.db.query(`config/${name}`)
                    .remove(ref => {
                        resolve(ref.length)
                    });
                });
            }
            if (exports.db) {
                await process()
            } else {
                setTimeout(process, 10);
            }
        } catch (e) {
            reject(e);
        }
    });
};

exports.process = async (name, callback, debug=false) => {
    if (debug) {
        local_log = (msg) => { console.log(msg); };
    } else {
        local_log = (msg) => {};
    }
    try {
        log("")
        log(`Buscando tarefa [${name}]`);
        const task = await exports.pick(name);
        if (task !== null) {
            log("Payload:");
            const payload = task.payload;
            log(`    ${JSON.stringify(payload)}`);
            if (callback) {
                if (task) {
                    local_log("");
                    log(`${await tools.now()} Executando processo = ${task._id}`);
                    local_log(`${await tools.now()} Executando processo = ${task._id}`);
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
                        await database.insert(`${name}_hist`, {
                            log: _log,
                            payload: payload,
                            tryout: task.tryout,
                            date: now,
                            history: task.history
                        });
                        await database.delete(name, { _id: task._id });
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

                        await database.update(name, { _id: task._id }, task);
                        await exports.rearm(name, task);
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