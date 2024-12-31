-- CreateTable
CREATE TABLE accounts (
    id VARCHAR(191) NOT NULL,
    "userId" VARCHAR(191) NOT NULL,
    type VARCHAR(191) NOT NULL,
    provider VARCHAR(191) NOT NULL,
    "providerAccountId" VARCHAR(191) NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at INTEGER,
    token_type VARCHAR(191),
    scope VARCHAR(191),
    id_token TEXT,
    session_state VARCHAR(191),
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

-- CreateTable
CREATE TABLE sessions (
    id VARCHAR(191) NOT NULL,
    "sessionToken" VARCHAR(191) NOT NULL,
    "userId" VARCHAR(191) NOT NULL,
    expires TIMESTAMP(3) NOT NULL,
    PRIMARY KEY (id)
);

-- CreateTable
CREATE TABLE users (
    id VARCHAR(191) NOT NULL,
    name VARCHAR(191),
    email VARCHAR(191),
    "emailVerified" TIMESTAMP(3),
    image VARCHAR(191),
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    stripe_customer_id VARCHAR(191),
    stripe_subscription_id VARCHAR(191),
    stripe_price_id VARCHAR(191),
    stripe_current_period_end TIMESTAMP(3),
    PRIMARY KEY (id)
);

-- CreateTable
CREATE TABLE verification_tokens (
    identifier VARCHAR(191) NOT NULL,
    token VARCHAR(191) NOT NULL,
    expires TIMESTAMP(3) NOT NULL
);

-- CreateIndexes
CREATE INDEX accounts_userid_idx ON accounts("userId");
CREATE UNIQUE INDEX accounts_provider_provideraccountid_key ON accounts(provider, "providerAccountId");
CREATE UNIQUE INDEX sessions_sessiontoken_key ON sessions("sessionToken");
CREATE INDEX sessions_userid_idx ON sessions("userId");
CREATE UNIQUE INDEX users_email_key ON users(email);
CREATE UNIQUE INDEX users_stripe_customer_id_key ON users(stripe_customer_id);
CREATE UNIQUE INDEX users_stripe_subscription_id_key ON users(stripe_subscription_id);
CREATE UNIQUE INDEX verification_tokens_token_key ON verification_tokens(token);
CREATE UNIQUE INDEX verification_tokens_identifier_token_key ON verification_tokens(identifier, token);

