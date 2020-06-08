const express = require("express")
const server = express()



//pegar o banco de dados
const db = require("./database/db-pg")
db.connect()
const query = {
    text: `CREATE SEQUENCE IF NOT EXISTS place_id_seq
    INCREMENT 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    START 1
    CACHE 1;

    CREATE TABLE IF NOT EXISTS places(
        id SERIAL PRIMARY KEY,
        name VARCHAR (200),
        image VARCHAR (200),
        address VARCHAR (200),
        address2 VARCHAR (200),
        state VARCHAR (200),
        city VARCHAR (200),
        items VARCHAR (200)
    );
`
}
db.query(query)

//configurar pasta publica
server.use(express.static("public"))

//habilitar o uso do req.body na nossa aplicação
server.use(express.urlencoded({ extended: true }))


//utilizando template engine

const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true
})

// configurar caminhos da aplicação
// pagina inicial
// req: Requisição
// res: Resposta
server.get("/", (req, res) => {
    return res.render("index.html", { title: "Um título" })
})

server.get("/create-point", (req, res) => {

    // req.query são os Query Strings da nossa Url
    console.log(req.query)

    return res.render("create-point.html")
})

server.post("/savepoint", (req, res) => {

    //req.body: O corpo do bosso formulário
    //console.log(req.body)

    //inserir dados no banco de dados
    const query = {
        text: 'INSERT INTO places (name,image,address,address2,state,city,items) VALUES ($1,$2,$3,$4,$5,$6,$7)',
        values: [
            req.body.name,
            req.body.image,
            req.body.address,
            req.body.address2,
            req.body.state,
            req.body.city,
            req.body.items
        ]
    }

    // function afterInserData(err) {
    //     if (err) {
    //         console.log(err)
    //         return res.send("Erro no Cadastro")
    //     }

    //     console.log("Cadastrado com sucesso")
    //     console.log(this)

    //     return res.render("create-point.html", { saved: true })
    // }

    // db.query(query, values, afterInserData)

    db
        .query(query)
        .then(rows => {
            console.log(rows.rows[0])

            return res.render("create-point.html", { saved: true })
        })
        .catch(e => console.error(e.stack))

})

server.get("/search", (req, res) => {

    const searchCity = req.query.searchCity
    const searchState = req.query.searchState

    if (searchCity == "" & searchState == "") {
        // pesquisa vazia
        return res.render("search-results.html", { total: 0 })

    } else if (searchCity != "" & searchState == "") {
        db
            .query(`SELECT * FROM places where city LIKE '%${searchCity}%'`, (err, rows) => {
                if (err) {
                    return console.log(err.stack)
                } else {
                    const total = rows.rowCount

                    //mostrar as páginas html com os bancos de dados
                    return res.render("search-results.html", { places: rows.rows, total })
                }
            })
    } else if (searchCity == "" & searchState != "") {
        db.query(`SELECT * FROM places where state LIKE '%${searchState}%'`, (err, rows) => {
            if (err) {
                return console.log(err.stack)
            } else {
                const total = rows.rowCount

                //mostrar as páginas html com os bancos de dados
                return res.render("search-results.html", { places: rows.rows, total })
            }
        })
    } else {
        db.query(`SELECT * FROM places where city LIKE '%${searchCity}%' and state LIKE '%${searchState}%'`, (err, rows) => {
            if (err) {
                return console.log(err.stack)
            } else {
                const total = rows.rowCount

                //mostrar as páginas html com os bancos de dados
                return res.render("search-results.html", { places: rows.rows, total })
            }
        })
    }
})

//ligar o servidor
server.listen(process.env.PORT || 3000)

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;