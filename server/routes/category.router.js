const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const { rejectUnauthenticated } = require('../modules/authentication-middleware');

// router.get('/list', rejectUnauthenticated, (req, res) => {
//     const queryText = `SELECT * FROM "category" WHERE "user_id" = ${req.user.id}`;

//     pool.query(queryText).then(async response => {
//         let payload = { categories: response.rows, sums: [] }
//         const newQueryText = `SELECT c.id, c.name, SUM(e.amount) FROM "category" as c
//                                 JOIN "expense" as e on c.id = e.category_id
//                                 WHERE c.id = $1 GROUP BY c.id;`;

//         for (const category of response.rows) {
//             const result = await pool.query(newQueryText, [category.id]); //.then(result => {
//             console.log(result.rows[0])
//             payload.sums.push(result.rows[0]);
//             // }).catch(err => {
//             //     console.log(`Error fetching sum for category at id: ${category.id}`, err);
//             //     res.sendStatus(500);
//             // });
//         };

//         console.log(payload)
//         console.log('Retrieved categories successfully');
//         res.send(payload).status(200);
//     }).catch(err => {
//         console.log('Error in getting categories', err);
//         res.sendStatus(500);
//     });
// });

router.get('/', rejectUnauthenticated, async (req, res) => {
    const queryText = `SELECT * FROM "category" WHERE "user_id" = ${req.user.id}`;

    try {
        const response = await pool.query(queryText);

        let categories = [];

        const newQueryText = `SELECT c.id, c.name, SUM(e.amount) FROM "category" as c
                                JOIN "expense" as e on c.id = e.category_id
                                WHERE c.id = $1 GROUP BY c.id;`;

        for (const category of response.rows) {
            const result = await pool.query(newQueryText, [category.id]);
            categories.push(result.rows[0]);
        };

        console.log('Retrieved categories successfully');
        res.send(categories).status(200);
    } catch (err) {
        console.log('Error in getting categories', err);
        res.sendStatus(500);
    };
});

router.post('/spent', rejectUnauthenticated, (req, res) => {
    const queryText = `SELECT c.id, c.name, SUM(e.amount) FROM "category" as c
                        JOIN "expense" as e on c.id = e.category_id
                        WHERE c.id = $1 GROUP BY c.id;`;

    console.log(req.body)
});

module.exports = router;