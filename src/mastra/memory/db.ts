// CORE
import { PostgresStore, PgVector } from "@mastra/pg";
// CONSTANTS
import { DATABASE_URL } from "@/utils/constants";
// TYPES

let sharedStore: PostgresStore;
let sharedVector: PgVector;

const getSharedStore = (): PostgresStore => {
  if (!sharedStore) {
    sharedStore = new PostgresStore({
      connectionString: DATABASE_URL,
      schemaName: "public",
    });
  }
  return sharedStore;
};

const getSharedVector = (): PgVector => {
  if (!sharedVector) {
    sharedVector = new PgVector({
      connectionString: DATABASE_URL,
      schemaName: "public",
    });
  }
  return sharedVector;
};

export { getSharedStore, getSharedVector };