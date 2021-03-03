const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const moment = require('moment');

// POST

router.post('/', rejectUnauthenticated, (req, res) => {
    // Inserts a client created category into the category database

    const sqlQuery = `INSERT INTO "category" ("user_id", "name", "necessity")
                        VALUES (${req.user.id}, $1, ${req.body.necessity});`;

    if (!req.body.name) {
        console.log('Try again with a valid field');
        res.sendStatus(400);
        return;
    };

    pool.query(sqlQuery, [`${req.body.name}`]).then(() => {
        console.log('Added new category successfully');
        res.sendStatus(201);
    }).catch(err => {
        console.log('Error in adding category', err);
        res.sendStatus(500);
    });
});

// GET

router.get('/main', rejectUnauthenticated, (req, res) => {
    // Gets all client created categoreis from the database

    const newQueryText = `SELECT c.id, c.name, COALESCE(SUM(th.amount), 0) FROM "category" as c
                            FULL JOIN "transaction-history" as th on c.id = th.category_id
                            WHERE c.user_id = ${req.user.id} GROUP BY c.id ORDER BY COALESCE DESC;`;

    pool.query(newQueryText).then(result => {
        console.log('Retrieved categories successfully');
        res.send(result.rows).status(200);
    }).catch(err => {
        console.log('Error in getting categories', err);
        res.sendStatus(500);
    });
});

router.get('/sub', rejectUnauthenticated, (req, res) => {
    // Gets all subcategories (categories associated to the transactions pulled from plaid) from the database

    const sqlQuery = `SELECT "name", COUNT("name") FROM "subcategory"
                        WHERE "user_id" = ${req.user.id} GROUP BY "name" 
                        ORDER BY COUNT DESC;`;
    
    pool.query(sqlQuery).then(response => {
        console.log('Retrieved subcategories successfully');
        res.send(response.rows).status(200);
    }).catch(err => {
        console.log('Error in getting subcategories', err);
        res.sendStatus(500);
    });;
});

router.get('/daily/:day', rejectUnauthenticated, (req, res) => {
    // Gets all client created categories associated to the day sent over from the client

    const dayToQuery = moment().add(req.params.day, 'days').format('YYYY-MM-DD');
    const sqlQueryTwo = `SELECT c.id, c.name, SUM(th.amount) FROM "category" as c
                            JOIN "transaction-history" as th on c.id = th.category_id
                            WHERE c.user_id = ${req.user.id} AND th.date = $1 GROUP BY c.id
                            ORDER BY SUM DESC;`;

    pool.query(sqlQueryTwo, [`${dayToQuery}`]).then(response => {
        console.log('Retrieved daily categories successfully');
        res.send(response.rows).status(200);
    }).catch(err => {
        console.log('Error in getting daily categories', err);
        res.sendStatus(500);
    });
});

router.get('/monthly/:month', rejectUnauthenticated, (req, res) => {
    // Gets all client created categories over the month that is sent over from the client

    const startMonthToQuery = moment().add(req.params.month, 'months').startOf('month').format('YYYY-MM-DD');
    const endMonthToQuery = moment().add(req.params.month, 'months').endOf('month').format('YYYY-MM-DD');
    const sqlQuery = `SELECT c.id, c.name, SUM(th.amount) FROM "category" as c
                        JOIN "transaction-history" as th on c.id = th.category_id
                        WHERE c.user_id = ${req.user.id} AND th.date BETWEEN $1 AND $2
                        GROUP BY c.id ORDER BY SUM DESC;`;

    pool.query(sqlQuery, [`${startMonthToQuery}`, `${endMonthToQuery}`]).then(response => {
        console.log('Retrieved monthly categories successfully');
        res.send(response.rows).status(200);
    }).catch(err => {
        console.log('Error in fetching monthly categories', err);
        res.sendStatus(500);
    });
});

// DELETE 

router.delete('/:id', rejectUnauthenticated, (req, res) => {
    // Deletes a client created category

    const sqlQuery = `DELETE FROM "category" WHERE "id" = ${req.params.id};`;

    pool.query(sqlQuery).then(() => {
        console.log('Deleted category successfully');
        res.sendStatus(204);
    }).catch(err => {
        console.log('Error in deleting category', err);
        res.sendStatus(500);
    });
});

module.exports = router;