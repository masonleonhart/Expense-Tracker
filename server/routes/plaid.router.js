const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const plaid = require('plaid');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const moment = require('moment');

const client = new plaid.Client({
    clientID: process.env.PLAID_CLIENT_ID,
    secret: process.env.PLAID_SECRET,
    env: plaid.environments[process.env.PLAID_ENV]
});

// POST

router.post('/link_token', rejectUnauthenticated, async (req, res) => {
    try {
        if (req.body.access_token) {
            const tokenResponse = await client.createLinkToken({
                user: {
                    client_user_id: `${req.user.id}`
                },
                client_name: 'solo spike',
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
    const dateToday = moment().format(`YYYY-MM-DD`);
    const earlierDate = moment().subtract(1, 'year').format('YYYY-MM-DD');

    const sqlQueryOne = `SELECT * FROM "transaction-history" WHERE "user_id" = ${req.user.id} ORDER BY "date" DESC;`;
    const sqlQueryTwo = `INSERT INTO "transaction-history" ("income", "user_id", "name", "amount", "date", "transaction_id")
                            VALUES (TRUE, ${req.user.id}, $1, $2, $3, $4);`;
    const sqlQueryThree = `INSERT INTO "transaction-history" ("user_id", "name", "amount", "date", "transaction_id")
                            VALUES (${req.user.id}, $1, $2, $3, $4);`;
    const SqlQueryFour = `INSERT INTO "subcategory" ("user_id", "name", "transaction_id")
                            VALUES (${req.user.id}, $1, $2);`;

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
                        await pool.query(SqlQueryFour, [category, newTransaction.transaction_id]);
                    };
                };
            };
        };

        console.log('Retrieved plaid transactions successfully');
        res.sendStatus(200);
    } catch (error) {
        console.log('Error in getting plaid transactions', error);
        res.sendStatus(500);
    };
});

router.post('/sandbox/reset_login', (req, res) => {
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