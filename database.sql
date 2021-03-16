-- USER is a reserved keyword with Postgres
-- You must use double quotes in every query that user is in:
-- ex. SELECT * FROM "user";
-- Otherwise you will have errors!

CREATE TABLE "user" (
    "id" SERIAL PRIMARY KEY,
    "email" VARCHAR (80) UNIQUE NOT NULL,
    "username" VARCHAR (80) UNIQUE NOT NULL,
    "password" VARCHAR (1000) NOT NULL,
    "access_token" VARCHAR (100) UNIQUE DEFAULT NULL,
    "admin_user" BOOLEAN DEFAULT FALSE,
    "plaid_key" VARCHAR (50) UNIQUE DEFAULT NULL
);

CREATE TABLE "plaid-keys" (
	"id" SERIAL PRIMARY KEY,
	"key" VARCHAR (50) UNIQUE NOT NULL,
	"user_id" INTEGER REFERENCES "user" DEFAULT NULL
);

CREATE TABLE "category" (
    "id" SERIAL PRIMARY KEY,
    "user_id" INTEGER REFERENCES "user" NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "necessity" BOOLEAN DEFAULT FALSE
);

CREATE TABLE "subcategory" (
	"id" SERIAL PRIMARY KEY,
	"user_id" INTEGER REFERENCES "user" NOT NULL,
	"name" VARCHAR(100) NOT NULL,
	"transaction_id" VARCHAR(100) NOT NULL,
	"date" DATE NOT NULL
);

CREATE TABLE "transaction-history" (
	"id" SERIAL PRIMARY KEY,
	"user_id" INTEGER REFERENCES "user" NOT NULL,
    "category_id" INTEGER REFERENCES "category" ON DELETE SET NULL,
	"name" VARCHAR(100) NOT NULL,
	"amount" DECIMAL(100, 2) NOT NULL,
	"date" DATE NOT NULL,
	"transaction_id" VARCHAR(100) UNIQUE DEFAULT NULL,
	"income" BOOLEAN DEFAULT FALSE
);

CREATE TABLE "feedback" (
	"id" serial PRIMARY KEY,
	"feedback" VARCHAR (1000)
);