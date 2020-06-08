const express = require("express")
const server = express()



//pegar o banco de dados
const db = require("./database/db")

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
    const query = `
        INSERT INTO places (
            name,
            image,
            address,
            address2,
            state,
            city,
            items
        ) VALUES (?,?,?,?,?,?,?);
    `

    const values = [
        req.body.name,
        req.body.image,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items,
    ]

    function afterInserData(err) {
        if (err) {
            console.log(err)
            return res.send("Erro no Cadastro")
        }

        console.log("Cadastrado com sucesso")
        console.log(this)

        return res.render("create-point.html", { saved: true })
    }

    db.run(query, values, afterInserData)


})

server.get("/search", (req, res) => {

    const searchCity = req.query.searchCity
    const searchState = req.query.searchState

    if (searchCity == "" & searchState == "") {
        // pesquisa vazia
        return res.render("search-results.html", { total: 0 })

    } else if (searchCity != "" & searchState == "") {
        db.all(`SELECT * FROM places where city LIKE '%${searchCity}%'`, function(err, rows) {
            if (err) {
                return console.log(err)
            }

            const total = rows.length

            //mostrar as páginas html com os bancos de dados
            return res.render("search-results.html", { places: rows, total })
        })
    } else if (searchCity == "" & searchState != "") {
        db.all(`SELECT * FROM places where state LIKE '%${searchState}%'`, function(err, rows) {
            if (err) {
                return console.log(err)
            }

            const total = rows.length

            //mostrar as páginas html com os bancos de dados
            return res.render("search-results.html", { places: rows, total })
        })
    } else {
        db.all(`SELECT * FROM places where city LIKE '%${searchCity}%' and state LIKE '%${searchState}%'`, function(err, rows) {
            if (err) {
                return console.log(err)
            }

            const total = rows.length

            //mostrar as páginas html com os bancos de dados
            return res.render("search-results.html", { places: rows, total })
        })
    }
})

//ligar o servidor
server.listen(process.env.PORT || 8080)