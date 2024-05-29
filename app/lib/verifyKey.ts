import { sql } from "@vercel/postgres";
import bcrypt from "bcryptjs";

const verifyAPIKey = async (apiKey: string) => {
  try {
    const result =
      await sql`SELECT api_key_hash, active FROM api_keys WHERE active = true;`;
    for (const row of result.rows) {
      if (await bcrypt.compare(apiKey, row.api_key_hash)) {
        return true;
      }
    }
    return false;
  } catch (error) {
    throw new Error(`Error verifying API key: ${error}`);
  }
};

export default verifyAPIKey;
