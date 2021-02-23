const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const { rejectUnauthenticated } = require('../modules/authentication-middleware');

// POST

router.post('/', rejectUnauthenticated, (req, res) => {
    const sqlQuery = `INSERT INTO "expense" ("user_id", "category_id", "name", "amount", "date")
                        VALUES (${req.user.id}, $1, $2, $3, $4);`;

    let category_id = req.body.category_id === 0 ? null : req.body.category_id;
    
    pool.query(sqlQuery, [category_id, req.body.name, req.body.amount, req.body.date]).then(() => {
        console.log('Added new expense successfully');
        res.sendStatus(201);
    }).catch(err => {
        console.log('Error in adding expense', err);
        res.sendStatus(500);
    });
});

// GET

router.get('/', rejectUnauthenticated, (req, res) => {
    const sqlQuery = `SELECT * FROM "expense" WHERE "user_id" = ${req.user.id}`;

    pool.query(sqlQuery).then(response => {
        console.log('Retrieved expenses successfully ');
        res.send(response.rows).status(200);
    }).catch(err => {
        console.log('Error in getting expenses', err);
        res.sendStatus(500);
    });
});

// PUT

router.put('/unassigned/:id', rejectUnauthenticated, (req, res) => {
    const sqlQuery = `UPDATE "expense" SET "category_id" = ${req.body.category_id}
                        WHERE id = ${req.params.id};`;

    pool.query(sqlQuery).then(() => {
        console.log('Updated unassigned category successfully');
        res.sendStatus(200);
    }).catch(err => {
        console.log('Error in updating unassigned category', err);
        res.sendStatus(500);
    });
});

module.exports = router;