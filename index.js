const fs = require('fs');
const env = require('subheaven-env');
const tools = require('subheaven-tools');
const log = require('debug')('iacon-mb:index');

env.addParams([
    { name: 'DBPATH', description: 'Caminho da pasta do banco de dados', required: true, sample: './db' },
    { name: 'DBNAME', description: 'Nome do banco de dados', required: true, sample: 'iacon' }
]);
(async() => {
    await env.config();

    if (!fs.existsSync(process.env.DBPATH)) {
        log(process.env)
        fs.mkdirSync(process.env.DBPATH);
    }

    exports.ready = false;
    
    const { AceBase } = require('acebase');
    const options = { info: '', logLevel: 'error', storage: { path: process.env.DBPATH } };
    exports.db = new AceBase(process.env.DBNAME, options);
})();

exports.insert = (collection, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let process = async () => {
                exports.db.ready(() => {
                    const ref = exports.db.ref(collection).push();
                    data['_id'] = ref.key;
                    ref.set(data)
                    .then(ref => {
                        resolve(ref);
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

exports.findAll = (collection) => {
    return new Promise(async (resolve, reject) => {
        try {
            let process = async () => {
                exports.db.ready(() => {
                    exports.db.query(collection)
                    .sort('date', true)
                    .get(snapshot => {
                        resolve(snapshot.getValues());
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

exports.find = (collection, filter1, filter2, filter3) => {
    return new Promise(async (resolve, reject) => {
        try {
            let process = async () => {
                exports.db.ready(() => {
                    exports.db.query(collection)
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

exports.oldest = (collection) => {
    return new Promise(async (resolve, reject) => {
        try {
            let process = async () => {
                exports.db.ready(() => {
                    exports.db.query(collection)
                    .sort('date', true)
                    .take(1)
                    .get(snapshots => {
                        let query = snapshots.getValues();
                        query = query.length > 0 ? query[0] : null;
                        resolve(query)
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

exports.remove = (collection, id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let process = async () => {
                exports.db.ready(() => {
                    exports.db.query(collection)
                    .filter('_id', '==', id)
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

exports.removeAll = (collection) => {
    return new Promise(async (resolve, reject) => {
        try {
            let process = async () => {
                exports.db.ready(() => {
                    exports.db.query(collection)
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

exports.update = (collection, id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let process = async () => {
                exports.db.ready(async () => {
                    const dataRef = await exports.db.ref(`${collection}/${id}`).update(data);
                    resolve();
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
    return new Promise(async (resolve, reject) => {
        try {
            let process = async () => {
                exports.db.ready(() => {
                    exports.db.query(name)
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

exports.rearm = async (name, id = '') => {
    return new Promise(async (resolve, reject) => {
        try {
            let process = async () => {
                exports.db.ready(() => {
                    if (id == '') {
                        log("Rearmando todas as tarefas");
                        exports.db.query(name)
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
                        exports.db.query(name)
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
                            await exports.remove(name, task._id);
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
    let tasks = await exports.findAll(name);
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
    detail.history = await exports.findAll(`${name}_hist`);
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
    let history = await exports.findAll(`${name}_hist`);

    while (history.length > h_size) {
        let item = history.shift();
        await project.remove(`${name}_hist`, item._id);
    }
}

exports.updateConfig = (name, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let process = async () => {
                exports.db.ready(async () => {
                    await tools.debug(data)
                    const dataRef = await exports.db.ref(`config/${name}`).update(data)
                    .then(async ref => {
                        await tools.debug("THEN")
                        await tools.debug(ref);
                        return ref;
                    })
                    .catch(async err => {
                        await tools.debug("CATCH")
                        await tools.debug(err);
                    });
                    tools.debug(name);
                    await exports.db.ref(`config/${name}/pass`).update('AAAAAAA');
                    await tools.debug(dataRef)
                    resolve();
                });
            }
            if (exports.db) {
                await process()
            } else {
                setTimeout(process, 10);
            }
        } catch (e) {
            console.log(e);
            reject(e);
        }
    });
}

exports.setConfig = async (name, config) => {
    await exports.removeConfig(name);
    await exports.insert(`config/${name}`, config);
    return 0
}

exports.getConfig = async (name) => {
    let teste = await exports.findAll(`config/${name}`);
    await tools.debug(teste);
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
                    log(`Executando processo = ${task._id}`);
                    local_log(`Executando processo = ${task._id}`);
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
                        await exports.clearHistory(name);
                    } catch (ex) {
                        log("Erro ao executar processo:");
                        _oldlog("Erro ao executar processo:");

                        let stk = new Error().stack;
                        stk = stk.split('\n').splice(2, stk.split('\n').length);
                        _log = `${_log}\n${ex.toString()}\n${stk.join('\n')}\n`;
                        log(_log);
                        _oldlog(_log);

                        task.log = _log;
                        task.tryout = task.tryout + 1;
                        await exports.update(name, task._id, task);
                        await exports.rearm(name, task._id);
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