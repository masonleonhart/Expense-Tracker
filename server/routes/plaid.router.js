const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const plaid = require('plaid');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const moment = require('moment');

const client = new plaid.Client({
    // Creates the plaid client required to access the plaid api

    clientID: process.env.PLAID_CLIENT_ID,
    secret: process.env.PLAID_SECRET,
    env: plaid.environments[process.env.PLAID_ENV]
});

// POST

router.post('/link_token', rejectUnauthenticated, async (req, res) => {
    // Creates a link token for the plaid api ( if there is an access token sent over from the client
    // then the function creates a new link without creating a new public key ( if there was an error
    // in the user's credentials and they need to refresh their login ) )

    try {
        if (req.body.access_token) {
            const tokenResponse = await client.createLinkToken({
                user: {
                    client_user_id: `${req.user.id}`
                },
                client_name: 'Expense Tracker',
                country_codes: ['US'],
                language: 'en',
                access_token: req.body.access_token
            });

            console.log('Created link token successfully');
            res.send(tokenResponse).status(201);
        } else {
            const tokenResponse = await client.createLinkToken({
                user: {
                    client_user_id: `${req.user.id}`
                },
                client_name: 'Expense Tracker',
                products: ['transactions'],
                country_codes: ['US'],
                language: 'en'
            });

            console.log('Created link token successfully');
            res.send(tokenResponse).status(201);
        };
    } catch (error) {
        console.log('Error in getting link token', error);
        res.sendStatus(500);
    };
});

router.post('/exchange_token', rejectUnauthenticated, async (req, res) => {
    // Exchanges the public token that was sent over from the client for an access token

    const PUBLIC_TOKEN = req.body.public_token;
    const sqlQuery = `UPDATE "user" SET "access_token" = $1 WHERE ID = ${req.user.id};`;

    try {
        const response = await client.exchangePublicToken(PUBLIC_TOKEN);
        await pool.query(sqlQuery, [response.access_token]);

        console.log('Exchanged tokens successfully');
        res.sendStatus(200);
    } catch (error) {
        console.log('Error in exchanging tokens', error);
        res.sendStatus(500);
    };
});

// GET

router.get('/transactions', rejectUnauthenticated, async (req, res) => {
    // Gets all transactions that are already in the database. Compares the transactions to the new
    // transactions incoming from plaid by the transaction id. If the transaction already appears in the
    // database, then skip to the next one, else, check if the transaction is an expense or an income.
    // If the transaction is an income, insert into the transaction database with the constraint of TRUE 
    // in the income column. If the transaction is an expense, insert into the transaction database normally
    // and check for categories. Loop over the categories array of the transaction and insert each category 
    // into the subcategory database with the transaction id associated to that category.

    const dateToday = moment().format(`YYYY-MM-DD`);
    const earlierDate = moment().subtract(1, 'year').format('YYYY-MM-DD');

    const sqlQueryOne = `SELECT * FROM "transaction-history" WHERE "user_id" = ${req.user.id} ORDER BY "date" DESC;`;
    const sqlQueryTwo = `INSERT INTO "transaction-history" ("income", "user_id", "name", "amount", "date", "transaction_id")
                            VALUES (TRUE, ${req.user.id}, $1, $2, $3, $4);`;
    const sqlQueryThree = `INSERT INTO "transaction-history" ("user_id", "name", "amount", "date", "transaction_id")
                            VALUES (${req.user.id}, $1, $2, $3, $4);`;
    const SqlQueryFour = `INSERT INTO "subcategory" ("user_id", "name", "transaction_id", "date")
                            VALUES (${req.user.id}, $1, $2, $3);`;

    try {
        const queryResponseOne = await pool.query(sqlQueryOne);
        const plaidResponse = await client.getTransactions(req.user.access_token, earlierDate, dateToday);

        for (const newTransaction of plaidResponse.transactions) {
            if (!queryResponseOne.rows.some(oldTransaction => oldTransaction.transaction_id === newTransaction.transaction_id)) {
                if (newTransaction.amount < 0) {
                    await pool.query(sqlQueryTwo, [`${newTransaction.name}`, Number(newTransaction.amount), `${newTransaction.date}`, `${newTransaction.transaction_id}`]);
                } else {
                    await pool.query(sqlQueryThree, [`${newTransaction.name}`, Number(newTransaction.amount), `${newTransaction.date}`, `${newTransaction.transaction_id}`]);
                    for (const category of newTransaction.category) {
                        await pool.query(SqlQueryFour, [category, newTransaction.transaction_id, `${newTransaction.date}`]);
                    };
                };
            };
        };

        console.log('Retrieved plaid transactions successfully');
        res.sendStatus(200);
    } catch (error) {
        let errorStatus = 500;

        if (error.error_code === 'ITEM_LOGIN_REQUIRED') {
            errorStatus = 400
        };

        console.log('Error in getting plaid transactions', error);
        res.sendStatus(errorStatus);
    };
});

router.post('/sandbox/reset_login', (req, res) => {
    // a sandbox endpoint to reset the login of the current user so they have to re-enter their credentials

    try {
        client.resetLogin(req.body.access_token).then(() => {
            console.log('Reset login successfully');
            res.sendStatus(200);
        });
    } catch (error) {
        console.log('Error in resetting login', error);
        res.sendStatus(500);
    };
});

module.exports = router;