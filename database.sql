-- USER is a reserved keyword with Postgres
-- You must use double quotes in every query that user is in:
-- ex. SELECT * FROM "user";
-- Otherwise you will have errors!

CREATE TABLE "user" (
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR (80) UNIQUE NOT NULL,
    "password" VARCHAR (1000) NOT NULL,
    "access_token" VARCHAR (100) UNIQUE DEFAULT NULL,
    "new_user" BOOLEAN DEFAULT TRUE
);

CREATE TABLE "category" (
    "id" SERIAL PRIMARY KEY,
    "user_id" INTEGER REFERENCES "user" NOT NULL,
    "name" VARCHAR(100) NOT NULL
);

CREATE TABLE "expense" (
	"id" SERIAL NOT NULL,
	"user_id" INTEGER REFERENCES "user" NOT NULL,
    "category_id" INTEGER REFERENCES "categories" DEFAULT NULL,
	"name" VARCHAR(100) NOT NULL,
	"amount" DECIMAL(100, 2) NOT NULL,
	"date" VARCHAR(30) NOT NULL,
	"transaction_id" VARCHAR(100) UNIQUE DEFAULT NULL
);

CREATE TABLE "income" (
	"id" SERIAL NOT NULL,
	"user_id" INTEGER REFERENCES "user" NOT NULL,
	"name" VARCHAR(100) NOT NULL,
	"amount" DECIMAL(100, 2) NOT NULL,
	"date" VARCHAR(30) NOT NULL,
	"transaction_id" VARCHAR(100) DEFAULT NULL
);