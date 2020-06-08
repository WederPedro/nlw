const { Client } = require('pg')

const db = new Client({
    user: 'glrfosubihnmxx',
    host: 'ec2-52-202-146-43.compute-1.amazonaws.com',
    database: 'demtk97qp3u902',
    password: '669b497e329505610cd3bb948a8e31c315dd378125125ea07d6b9d48450f8f10',
    port: 5432,
    ssl: true,
})

module.exports = db