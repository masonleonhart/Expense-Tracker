const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const { rejectUnauthenticated } = require('../modules/authentication-middleware');

// POST

router.post('/', rejectUnauthenticated, (req, res) => {
    const sqlQuery = `INSERT INTO "category" ("user_id", "name")
                        VALUES (${req.user.id}, $1);`;

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

router.get('/', rejectUnauthenticated, (req, res) => {
    const newQueryText = `SELECT c.id, c.name, COALESCE(SUM(e.amount), 0) FROM "category" as c
                            FULL JOIN "expense" as e on c.id = e.category_id
                            WHERE c.user_id = ${req.user.id} GROUP BY c.id ORDER BY COALESCE DESC;`;

    pool.query(newQueryText).then(result => {
        console.log('Retrieved categories successfully');
        res.send(result.rows).status(200);
    }).catch(err => {
        console.log('Error in getting categories', err);
        res.sendStatus(500);
    });
});

// DELETE 

router.delete('/:id', rejectUnauthenticated, (req, res) => {
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