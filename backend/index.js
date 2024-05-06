const express = require('express')
const axios = require("axios");
const cors = require("cors");
// const db = require('./database')
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express()

app.use(cors())
app.use(express.json())

const dbPath = path.join(__dirname, "roxilerdatabase.db");

let db = null;


const initializeDBAndServer = async () => {
    try {
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database,
        });
        app.listen(3001, () => {
            console.log(`Server Running at http://localhost:3001/`);
        });
    } catch (e) {
        console.log(`DB Error: ${e.message}`);
        process.exit(1);
    }
};

initializeDBAndServer();


const fetchAndInsert = async () => {
    const response = await axios.get(
        "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );
    const data = response.data;

    for (let item of data) {
        const queryData = `SELECT id FROM transactions WHERE id = ${item.id}`;
        const existingData = await db.get(queryData);
        if (existingData === undefined) {
            const query = `
   INSERT INTO transactions (id, title, price, description, category, image, sold, dateOfSale) 
   VALUES (
       ${item.id},
       '${item.title.replace(/'/g, "''")}',
       ${item.price},
       '${item.description.replace(/'/g, "''")}',
       '${item.category.replace(/'/g, "''")}',
       '${item.image.replace(/'/g, "''")}',
       ${item.sold},
       '${item.dateOfSale.replace(/'/g, "''")}'
   );
`; /*The .replace(/'/g, "''") in the SQL query helps prevent SQL injection attacks by escaping single quotes.*/

            await db.run(query);
        }
    }
    console.log("Transactions added");
};

fetchAndInsert();

app.get('/gettransactions', async (req, res) => {
    try {
        const { search = "", page = 1 } = req.query;
        console.log(search, "search-----")
        const per_page = 10;
        let query = `
            SELECT *
            FROM transactions
        `;
        if (search !== "") {
            const lowerCaseSearch = search.toLowerCase(); // Lowercasing the search parameter
            query += `
                WHERE LOWER(title) LIKE '%${lowerCaseSearch}%' OR
                      LOWER(description) LIKE '%${lowerCaseSearch}%' OR
                      LOWER(price) LIKE '%${lowerCaseSearch}%'
            `;
        }
        const limit = per_page;
        const offset = (page - 1) * per_page;
        query += `
            LIMIT ${limit} OFFSET ${offset}
        `;
        const transactionsArray = await db.all(query);
        res.status(200).send(transactionsArray);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});

app.get('/getmonthstatisctics', async (req, res) => {
    try {
        const { month = "June" } = req.query;
        
        const monthMap = {
            "January": "01",
            "February": "02",
            "March": "03",
            "April": "04",
            "May": "05",
            "June": "06",
            "July": "07",
            "August": "08",
            "September": "09",
            "October": "10",
            "November": "11",
            "December": "12"
        };

        const monthNumeric = monthMap[month];

        let soldquery = `
            SELECT COUNT(*) AS transactionCount, SUM(price) AS totalSales
            FROM transactions
            WHERE sold = 1 
            AND strftime("%m", dateOfSale) = '${monthNumeric}'
        `;
       
        const soldData = await db.get(soldquery);
        let unsoldquery = `
            SELECT COUNT(*) AS transactionCount
            FROM transactions
            WHERE sold = 0
            AND strftime("%m", dateOfSale) = '${monthNumeric}'
        `;
       
        const unsoldqueryData = await db.get(unsoldquery); 
        res.status(200).send({soldData: soldData, unSoldData:unsoldqueryData});
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});

// app.get('/getquantity', async (req, res) => {
//     try {
//         const { month = "June" } = req.query;
        
//         const monthMap = {
//             "January": "01",
//             "February": "02",
//             "March": "03",
//             "April": "04",
//             "May": "05",
//             "June": "06",
//             "July": "07",
//             "August": "08",
//             "September": "09",
//             "October": "10",
//             "November": "11",
//             "December": "12"
//         };

//         const monthNumeric = monthMap[month];

//         let query = `
//             SELECT COUNT(*) AS numberOfItems
//             FROM transactions
//             WHERE strftime("%m", dateOfSale) = '${monthNumeric}'
//         `;
       
//         const queryResult = await db.get(query); 
//         res.status(200).send(queryResult);
//     } catch (error) {
//         console.log(error);
//         res.status(500).send("Internal Server Error");
//     }
// });

app.get('/getquantity', async (req, res) => {
    try {
        const { month = "June" } = req.query;
        
        const monthMap = {
            "January": "01",
            "February": "02",
            "March": "03",
            "April": "04",
            "May": "05",
            "June": "06",
            "July": "07",
            "August": "08",
            "September": "09",
            "October": "10",
            "November": "11",
            "December": "12"
        };

        const monthNumeric = monthMap[month];

        let query = `
            SELECT
                CASE
                    WHEN price BETWEEN 0 AND 100 THEN '0 - 100'
                    WHEN price BETWEEN 101 AND 200 THEN '101 - 200'
                    WHEN price BETWEEN 201 AND 300 THEN '201 - 300'
                    WHEN price BETWEEN 301 AND 400 THEN '301 - 400'
                    WHEN price BETWEEN 401 AND 500 THEN '401 - 500'
                    WHEN price BETWEEN 501 AND 600 THEN '501 - 600'
                    WHEN price BETWEEN 601 AND 700 THEN '601 - 700'
                    WHEN price BETWEEN 701 AND 800 THEN '701 - 800'
                    WHEN price BETWEEN 801 AND 900 THEN '801 - 900'
                    ELSE '901-above'
                END AS priceRange,
                COUNT(*) AS numberOfItems
            FROM transactions
            WHERE strftime("%m", dateOfSale) = '${monthNumeric}'
            GROUP BY priceRange
        `;
       
        const queryResult = await db.all(query); 
        res.status(200).send(queryResult);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});
