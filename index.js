const fs = require('fs');
const env = require('subheaven-env');
const tools = require('subheaven-tools');
const log = require('debug')('iacon-mb:index');

env.addParams([
    { name: 'DBPATH', description: 'Caminho da pasta do banco de dados', required: true, sample: './db' },
    { name: 'DBNAME', description: 'Nome do banco de dados', required: true, sample: 'iacon' }
]);
env.config();

if (!fs.existsSync(process.env.DBPATH)) {
    fs.mkdirSync(process.env.DBPATH);
}

exports.ready = false;

const { AceBase } = require('acebase');
const options = { info: '', logLevel: 'error', storage: { path: process.env.DBPATH } };
const db = new AceBase(process.env.DBNAME, options);

exports.insert = (collection, data) => {
    return new Promise((resolve, reject) => {
        try {
            db.ready(() => {
                const ref = db.ref(collection).push();
                data['_id'] = ref.key;
                ref.set(data)
                .then(ref => {
                    resolve(ref);
                });
            });
        } catch (e) {
            reject(e);
        }
    });
};

exports.findAll = (collection) => {
    return new Promise((resolve, reject) => {
        try {
            db.ready(() => {
                db.query(collection)
                .sort('date', true)
                .get(snapshot => {
                    resolve(snapshot.getValues());
                });
            });
        } catch (e) {
            reject(e);
        }
    });
};

exports.find = (collection, filter1, filter2, filter3) => {
    return new Promise((resolve, reject) => {
        try {
            db.ready(() => {
                db.query(collection)
                .filter(filter1, filter2, filter3)
                .get(snapshot => {
                    let dataset = snapshot.getValues();
                    if (dataset.length > 0) {
                        resolve(dataset[0]);
                    } else {
                        resolve(null);
                    }
                });
            });
        } catch (e) {
            reject(e);
        }
    });
};

exports.oldest = (collection) => {
    return new Promise((resolve, reject) => {
        try {
            db.ready(() => {
                db.query(collection)
                .sort('date', true)
                .take(1)
                .get(snapshots => {
                    let query = snapshots.getValues();
                    query = query.length > 0 ? query[0] : null;
                    resolve(query)
                });
            });
        } catch (e) {
            reject(e);
        }
    });
};

exports.remove = (collection, id) => {
    return new Promise((resolve, reject) => {
        try {
            db.ready(() => {
                db.query(collection)
                .filter('_id', '==', id)
                .remove(ref => {
                    resolve(ref.length)
                });
            });
        } catch (e) {
            reject(e);
        }
    });
};

exports.update = (collection, id, data) => {
    return new Promise((resolve, reject) => {
        try {
            db.ready(async () => {
                const dataRef = await db.ref(`${collection}/${id}`).update(data);
                resolve();
            });
        } catch (e) {
            reject(e);
        }
    });
}

exports.add = async (name, payload) => {
    let now = new Date();
    let d = await exports.insert(name, { payload: payload, date: now, picked: false, tryout: 0, history: [ { date:  now, name: 'added' } ] });
    return d.key;
};

exports.list = async (name) => {
    let tasks = await exports.findAll(name);
    return tasks.map(item => item);
};

exports.pick = async (name) => {
    return new Promise((resolve, reject) => {
        try {
            db.ready(() => {
                db.query(name)
                .filter('picked', '!=', true)
                .sort('date', true)
                .take(1)
                .get(async snapshots => {
                    let now = new Date();
                    let tasks = snapshots.getValues();
                    task = tasks.length > 0 ? tasks[0] : null;
                    if (task) {
                        task.history.push({
                            date: now,
                            name: 'picked'
                        });
                        task.picked = true;
                        await exports.update(name, task._id, task);
                    }
                    resolve(task)
                });
            });
        } catch (e) {
            reject(e);
        }
    });
};

exports.rearm = async (name, id = '') => {
    return new Promise((resolve, reject) => {
        try {
            db.ready(() => {
                if (id == '') {
                    log("Rearmando todas as tarefas");
                    db.query(name)
                    .filter('picked', '==', true)
                    .get(async snapshots => {
                        let now = new Date();
                        let tasks = snapshots.getValues();
                        await tasks.forEachAsync(async task => {
                            log(`    Tarefa ${task._id}`);
                            task.history.push({
                                date: now,
                                name: 'rearm'
                            });
                            task.picked = false;
                            task.date = new Date();
                            await exports.update(name, task._id, task);
                            log(`        Tarefa rearmada`);
                        });
                        resolve(tasks);
                    });
                } else {
                    log(`Rearmando a tarefa ${id}`);
                    db.query(name)
                    .filter('_id', '==', id)
                    .get(async snapshots => {
                        let now = new Date();
                        let tasks = snapshots.getValues();
                        await tasks.forEachAsync(async task => {
                            task.history.push({
                                date: now,
                                name: 'rearm'
                            });
                            task.picked = false;
                            task.date = new Date();
                            await exports.update(name, task._id, task);
                            log(`    Tarefa rearmada`);
                        });
                        resolve(tasks);
                    });
                }
            });
        } catch (e) {
            reject(e);
        }
    });
};

exports.close = (name, id) => {
    return new Promise((resolve, reject) => {
        try {
            db.ready(() => {
                db.query(name)
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
                        await exports.remove(name, task._id);
                    };
                    resolve(task)
                });
            });
        } catch (e) {
            reject(e);
        }
    });
}

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
                    log(`Executando processo = ${task._id}`);
                    local_log(`Executando processo = ${task._id}`);
                    let copy = JSON.stringify(task);
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
                        await callback(payload, task);
                        log("Processo executado com sucesso:");
                        _oldlog("Processo executado com sucesso:");
                        log("");
                        log(_log);
                        log("");
                        log("Gravando histórico.");
                        let now = new Date();
                        task.history.push({
                            date: now,
                            name: 'processed'
                        });
                        await exports.insert(`${name}_hist`, {
                            log: _log,
                            payload: payload,
                            date: now,
                            history: task.history
                        });
                        log("Finalizando processo.");
                        await exports.remove(name, task._id);
                    } catch (ex) {
                        log("Erro ao executar processo:");
                        _oldlog("Erro ao executar processo:");

                        let stk = new Error().stack;
                        stk = stk.split('\n').splice(2, stk.split('\n').length);
                        _log = `${_log}\n${ex.toString()}\n${stk.join('\n')}\n`;
                        log(_log);
                        _oldlog(_log);

                        task.log = _log;
                        await exports.update(name, task._id, task);
                        await exports.rearm(name, task._id);
                    } finally {
                        console.log = _oldlog;
                        console.error = _olderror;
                        return _log;
                    }
                };
            } else {
                console.log("[ALERT] Não foi informado um callback para a tarefa. Sem isso a tarefa não será fechada.");
                return '';
            }
        } else {
            console.log("Nenhuma tarefa encontrada");
            return "Nenhuma tarefa encontrada";
        }
    } catch (e) {
        throw e;
    }
}