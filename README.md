# MELT Expense Tracker

## Application Description

This is a simple expense tracker application that allows you to link your personal bank account through a third party data aggregator, Plaid, and budget your personal finances through different daily, weekly, and monthly views.

## Application Prerequisites

1. Node.js
2. Postgres

## Installation

1. Open application and run "npm install" in your terminal
2. Copy SQL from database.sql into a database (Postgres and Postico recommended)
3. Run npm run server in your terminal to start the server
4. Run npm run client in your terminal to start the client

## Usage

1. Make an account or log in to an existing account
2. Import your bank statements through Plaid by logging in to your financial institution (login details are not saved by this applicaiton, just transaction details)
3. Sort your transactions by creating and applying different category filters to your transactions
4. Cleanly view your net income by seeing your money in / out for each day, week, and month

## Built With

1. React.js
2. Material UI
3. Plaid
