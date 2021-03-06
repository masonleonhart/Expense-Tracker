const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const moment = require('moment');

// POST

router.post('/', rejectUnauthenticated, (req, res) => {
    // Adds a client created expense to the database

    const sqlQuery = `INSERT INTO "transaction-history" ("user_id", "category_id", "name", "amount", "date", income)
                        VALUES (${req.user.id}, $1, $2, $3, $4, $5);`;

    if (!req.body.name, !req.body.amount, !req.body.date) {
        console.log('Try again with valid fields');
        res.sendStatus(400);
        return;
    };

    let category_id = req.body.category_id === '' ? null : req.body.category_id;

    pool.query(sqlQuery, [category_id, `${req.body.name}`, Number(`${req.body.income && '-'}${req.body.amount}`), `${req.body.date}`, req.body.income]).then(() => {
        console.log('Added new expense successfully');
        res.sendStatus(201);
    }).catch(err => {
        console.log('Error in adding expense', err);
        res.sendStatus(500);
    });
});

// GET

router.get('/uncategorized', rejectUnauthenticated, (req, res) => {
    // Grabs all uncategorized transactions from the database

    const sqlQuery = `SELECT th.id, th.name, th.amount, th.date, th.transaction_id, th.income, 
                                c.id as category_id, c.name as category_name
                        FROM "transaction-history" as th
                        FULL JOIN "category" as c on th.category_id = c.id
                        WHERE th.id IS NOT NULL AND th.user_id = ${req.user.id}
                        AND c.name IS NULL AND th.income = FALSE
                        ORDER BY th.date DESC;`;

    pool.query(sqlQuery).then(response => {
        console.log('Retrieved expenses successfully ');
        res.send(response.rows).status(200);
    }).catch(err => {
        console.log('Error in getting expenses', err);
        res.sendStatus(500);
    });
});

router.get('/category/transactions/:id', rejectUnauthenticated, (req, res) => {
    // Grabs all transactions associated to a specified category from the database

    const sqlQuery = `SELECT th."name", th."amount", th."date" FROM "category" as c
                        JOIN "transaction-history" as th on c."id" = th."category_id"
                        WHERE c."id" = '${req.params.id}' 
                        AND c."user_id" = ${req.user.id} ORDER BY DATE DESC;`;
    
    pool.query(sqlQuery).then(response => {
        console.log('Retrieved subcategory transactions successfully');
        res.send(response.rows).status(200);
    }).catch(err => {
        console.log('Error in fetching subcategory transactions', err);
        res.sendStatus(500);
    });
});

router.get('/subcategory/transactions/:name', rejectUnauthenticated, (req, res) => {
    // Grabs all plaid transactions associated to a specified subcategory (categories associated to the 
    // transactions pulled from plaid) from the database

    const sqlQuery = `SELECT * FROM "subcategory" WHERE "name" = '${req.params.name}' 
                        AND "user_id" = ${req.user.id} ORDER BY DATE DESC;`;
    
    pool.query(sqlQuery).then(response => {
        console.log('Retrieved subcategory transactions successfully');
        res.send(response.rows).status(200);
    }).catch(err => {
        console.log('Error in fetching subcategory transactions', err);
        res.sendStatus(500);
    });
});

router.get('/daily/:day', rejectUnauthenticated, (req, res) => {
    // Grabs all transactions from the database associated to the day that is specified from the client

    const dayToQuery = moment().add(req.params.day, 'days').format('YYYY-MM-DD');
    const sqlQuery = `SELECT th.id, th.name, th.amount, th. date, th.transaction_id, th.income,
                                c.id as category_id, c.name as category_name
                        FROM "transaction-history" as th
                        FULL JOIN "category" as c on th.category_id = c.id
                        WHERE th.id IS NOT NULL AND th.user_id = ${req.user.id} AND th.date = $1
                        ORDER BY th.date DESC;`;

    pool.query(sqlQuery, [`${dayToQuery}`]).then(response => {
        console.log('Retrieved daily transactions successfully');
        res.send(response.rows).status(200);
    }).catch(err => {
        console.log('Error in fetching daily transactions', err);
        res.sendStatus(500);
    });
});

router.get('/monthly/dailysums/:month', rejectUnauthenticated, (req, res) => {
    // Grabs all daily sums from the database over the month that is specified from the database

    const startMonthToQuery = moment().add(req.params.month, 'months').startOf('month').format('YYYY-MM-DD');
    const endMonthToQuery = moment().add(req.params.month, 'months').endOf('month').format('YYYY-MM-DD');
    const sqlQuery = `SELECT "date", SUM("amount") FROM "transaction-history"
                        WHERE "user_id" = ${req.user.id} AND "date" BETWEEN $1 AND $2
                        GROUP BY "date" ORDER BY "date" ASC;`;

    pool.query(sqlQuery, [`${startMonthToQuery}`, `${endMonthToQuery}`]).then(response => {
        console.log('Retrieved daily sums successfully');
        res.send(response.rows).status(200);
    }).catch(err => {
        console.log('Error in fetching daily sums', err);
        res.sendStatus(500);
    });
});

router.get('/monthly/:month', rejectUnauthenticated, (req, res) => {
    // Grabs all transactions from the database over the month that is specified from the database

    const startMonthToQuery = moment().add(req.params.month, 'months').startOf('month').format('YYYY-MM-DD');
    const endMonthToQuery = moment().add(req.params.month, 'months').endOf('month').format('YYYY-MM-DD');
    const sqlQuery = `SELECT th.id, th.name, th.amount, th. date, th.transaction_id, th.income, c.id as category_id, c.name as category_name
                        FROM "transaction-history" as th
                        FULL JOIN "category" as c on th.category_id = c.id
                        WHERE th.id IS NOT NULL AND th.user_id = ${req.user.id} 
                        AND th.date BETWEEN $1 AND $2 ORDER BY th.date DESC;`;

    pool.query(sqlQuery, [`${startMonthToQuery}`, `${endMonthToQuery}`]).then(response => {
        console.log('Retrieved monthly transactions successfully');
        res.send(response.rows).status(200);
    }).catch(err => {
        console.log('Error in fetching monthly transactions', err);
        res.sendStatus(500);
    });
});

// PUT

router.put('/unassigned/:id', rejectUnauthenticated, (req, res) => {
    // Updates the category to a client created category of an uncategorized transactions
    
    const sqlQuery = `UPDATE "transaction-history" SET "category_id" = ${req.body.category_id}
                        WHERE id = ${req.params.id};`;

    pool.query(sqlQuery).then(() => {
        console.log('Updated unassigned category successfully');
        res.sendStatus(200);
    }).catch(err => {
        console.log('Error in updating unassigned category', err);
        res.sendStatus(500);
    });
});

// DELETE 

router.delete(`/:id`, rejectUnauthenticated, (req, res) => {
    // Deletes a client created transaction

    const sqlQuery = `DELETE FROM "transaction-history" WHERE "id" = ${req.params.id};`;

    pool.query(sqlQuery).then(() => {
        console.log('Deleted expense successfully');
        res.sendStatus(204);
    }).catch(err => {
        console.log('Error in deleting expense', err);
        res.sendStatus(500);
    });
});

module.exports = router;