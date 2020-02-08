class Crud {
    constructor(dao) {
        this.dao = dao
    }

    createTable() {
        const sql = `
      CREATE TABLE IF NOT EXISTS ToDos (
        DT INTEGER PRIMARY KEY,
        ToDo TEXT)`
        return this.dao.run(sql);
    }

    insert(todo, dt) {
        return this.dao.run(
            'INSERT INTO ToDos (DT, ToDo) VALUES (?,?)',
            [dt, todo]);
    }

    delete(dt) {
        return this.dao.run(
            `DELETE FROM ToDos WHERE DT = ?`,
            [dt]
        );
    }

    getAll() {
        return this.dao.all(`SELECT * FROM ToDos`);
    }
}

export default Crud;