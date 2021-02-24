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
    const earlierDate = moment().subtract(1, 'month').format('YYYY-MM-DD');

    const sqlQueryOne = `SELECT * FROM "expense" WHERE "user_id" = ${req.user.id} ORDER BY "date" DESC;`;
    const sqlQueryTwo = `INSERT INTO "expense" ("income", "user_id", "name", "amount", "date", "transaction_id")
                            VALUES (TRUE, ${req.user.id}, $1, $2, $3, $4);`;
    const sqlQueryThree = `INSERT INTO "expense" ("user_id", "name", "amount", "date", "transaction_id")
                            VALUES (${req.user.id}, $1, $2, $3, $4);`;

    try {
        const queryResponseOne = await pool.query(sqlQueryOne);
        const plaidResponse = await client.getTransactions(req.user.access_token, earlierDate, dateToday);

        for (const newTransaction of plaidResponse.transactions) {
            if (!queryResponseOne.rows.some(oldTransaction => oldTransaction.transaction_id === newTransaction.transaction_id)) {
                if (newTransaction.amount < 0) {
                    await pool.query(sqlQueryTwo, [newTransaction.name, newTransaction.amount, newTransaction.date, newTransaction.transaction_id]);
                } else {
                    await pool.query(sqlQueryThree, [newTransaction.name, newTransaction.amount, newTransaction.date, newTransaction.transaction_id]);
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

module.exports = router;