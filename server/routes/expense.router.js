const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const { rejectUnauthenticated } = require('../modules/authentication-middleware');

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

module.exports = router;