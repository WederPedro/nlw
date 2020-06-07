// importar a dependência do sqlite3
const sqlite3 = require("sqlite3").verbose()

//iniciar o objeto que irá fazer operações no banco de dados
const db = new sqlite3.Database("./src/database/database.db")

module.exports = db

// utilizar o objeto de banco de dados, para nossas operações
db.serialize(() => {
    // Criar uma tabela
    // db.run(`
    //     CREATE TABLE IF NOT EXISTS places(
    //         id INTEGER PRIMARY KEY AUTOINCREMENT,
    //         name TEXT,
    //         image TEXT,
    //         address TEXT,
    //         address2 TEXT,
    //         state TEXT,
    //         city TEXT,
    //         items TEXT
    //     );
    // `)

    // // Inserir dados na tabela
    // const query = `
    //     INSERT INTO places (
    //         name,
    //         image,
    //         address,
    //         address2,
    //         state,
    //         city,
    //         items
    //     ) VALUES (?,?,?,?,?,?,?);
    // `

    // const values = [
    //     "Papersider",
    //     "https://www.montarumnegocio.com/wp-content/uploads/2017/06/papel3.jpg.webp",
    //     "Guilherme Gembala, Jardim América",
    //     "Nº 260",
    //     "Santa Catarina",
    //     "Rio do Sul",
    //     "Papéis e Papelão"
    // ]

    // function afterInserData(err) {
    //     if (err) {
    //         return console.log(err)
    //     }

    //     console.log("Cadastrado com sucesso")
    //     console.log(this)
    // }

    // db.run(query, values, afterInserData)


    // Consultar dados na tabela
    // db.all(`SELECT * FROM places`, function(err, rows) {
    //         if (err) {
    //             return console.log(err)
    //         }

    //         console.log("Aqui estão seus registros")
    //         console.log(rows)
    // })
    // Deletar dados na tabela
    // db.run(`DELETE FROM places WHERE id = ?`, [5], function(err) {
    //     if (err) {
    //         return console.log(err)
    //     }

    //     console.log("Registro deletado com sucesso.")
    // })


})