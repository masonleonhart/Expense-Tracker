const express = require('express');
const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');

const router = express.Router();

// Handles Ajax request for user information if user is authenticated
router.get('/', rejectUnauthenticated, (req, res) => {
  // Send back user object from the session (previously queried from the database)
  res.send(req.user);
});

// Handles POST request with new user data
// The only thing different from this and every other post we've seen
// is that the password gets encrypted before being inserted
router.post('/register', (req, res, next) => {
  const username = req.body.username;
  const password = encryptLib.encryptPassword(req.body.password);
  const email = req.body.email;

  const queryText = `INSERT INTO "user" (username, password, email)
    VALUES ($1, $2, $3) RETURNING id`;
  pool
    .query(queryText, [username, password, email])
    .then(() => res.sendStatus(201))
    .catch((err) => {
      console.log('User registration failed: ', err);
      res.sendStatus(500);
    });
});

// Handles login form authenticate/login POST
// userStrategy.authenticate('local') is middleware that we run on this route
// this middleware will run our POST if successful
// this middleware will send a 404 if not successful
router.post('/login', userStrategy.authenticate('local'), (req, res) => {
  res.sendStatus(200);
});

// clear all server session information about this user
router.post('/logout', (req, res) => {
  // Use passport's built-in method to log out the user
  req.logout();
  res.sendStatus(200);
});

router.put('/keycheck', rejectUnauthenticated, async (req, res) => {
  const sqlQueryOne = `SELECT * FROM "plaid-keys";`;
  const sqlQueryTwo = `UPDATE "plaid-keys" SET "user_id" = '${req.user.id}'
                          WHERE "key" = $1;`;
  const sqlQueryThree = `UPDATE "user" SET "plaid_key" = $1
                          WHERE "id" = '${req.user.id}';`;

  try {
    const responseOne = await pool.query(sqlQueryOne);

    for (const keyObj of responseOne.rows) {
      if (keyObj.key === req.body.keyInput) {
        const responseTwo = await pool.query(sqlQueryTwo, [req.body.keyInput]);
        const responseThree = await pool.query(sqlQueryThree, [req.body.keyInput]);

        console.log(`The key matched: ${keyObj.key}, for user: ${req.user.id}`);
        res.sendStatus(200);
        return;
      };
    };

    console.log('Wrong Key');
    res.sendStatus(400);
  } catch (error) {
    console.log('Error in checking keys', error);
    res.sendStatus(500);
  };
});

module.exports = router;
