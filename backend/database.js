const sqlite3 = require('sqlite3').verbose()

const dbName = 'roxilerdatabase.db'

// creating sqlite db

let db = new sqlite3.Database(dbName, (err) => {
    if (err) {
        console.error(`error connecting to db ${err.message}`)
    } else {
        console.log("Connected to DB")
        db.run('CREATE TABLE IF NOT EXISTS transactions (id INTEGER PRIMARY KEY, title TEXT, price FLOAT, description TEXT, category TEXT, image TEXT, sold BOOLEAN, dateOfSale TEXT)', (err) => {
            if (err) {
                console.error(`error creating table in db ${err.message}`)

            } else {
                console.log("Table already existed or created.")
            }
        })
    }
})

module.exports = db