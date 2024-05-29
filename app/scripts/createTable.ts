const { sql } = require("@vercel/postgres");
const dotenv = require("dotenv");
dotenv.config();
console.log(`POSTGRES_URL: ${process.env.POSTGRES_URL}`);

const initTables = async () => {
  try {
    const apiKeyTable = await sql`
      CREATE TABLE IF NOT EXISTS api_key (
          id SERIAL PRIMARY KEY,
          api_key_hash VARCHAR(255) UNIQUE NOT NULL,
          active BOOLEAN NOT NULL DEFAULT true,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;
    console.log(
      `API Key Table Created: ${JSON.stringify(apiKeyTable, null, 2)}`
    );

    const campaignTable = await sql`
      CREATE TABLE IF NOT EXISTS campaign (
        id SERIAL PRIMARY KEY,
        api_key_hash VARCHAR(255) NOT NULL,
        campaign_id VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        FOREIGN KEY (api_key_hash) REFERENCES api_keys (api_key_hash)
      );
    `;
    console.log(
      `Campaign Table Created: ${JSON.stringify(campaignTable, null, 2)}`
    );

    const pointTable = await sql`
    CREATE TABLE IF NOT EXISTS point (
        id SERIAL PRIMARY KEY,
        campaign_id VARCHAR(255) NOT NULL,
        address VARCHAR(255) NOT NULL,
        points INTEGER NOT NULL,
        last_modified TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE (campaign_id, address),
        FOREIGN KEY (campaign_id) REFERENCES campaigns (campaign_id)
      );
    `;
    console.log(`Point Table Created: ${JSON.stringify(pointTable, null, 2)}`);

    const eventTable = await sql`
      CREATE TABLE IF NOT EXISTS event (
        id SERIAL PRIMARY KEY,
        campaign_id VARCHAR(255) NOT NULL,
        address VARCHAR(255) NOT NULL,
        event_name VARCHAR(255) NOT NULL,
        point INTEGER NOT NULL,
        timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        FOREIGN KEY (campaign_id) REFERENCES campaigns (campaign_id)
      );
    `;
    console.log(`Event Table Created: ${JSON.stringify(eventTable, null, 2)}`);
  } catch (error) {
    console.error(`Error creating tables: ${error}`);
  }
};

initTables();
