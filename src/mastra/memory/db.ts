// CORE
import { PostgresStore, PgVector } from "@mastra/pg";
// CONSTANTS
import { DATABASE_URL } from "@/utils/constants";

let sharedStore: PostgresStore | null = null;
let sharedVector: PgVector | null = null;

const getSharedStore = () => {
  if (!sharedStore) {
    sharedStore = new PostgresStore({
      connectionString: DATABASE_URL,
      schemaName: "public",
    });
  }
  return sharedStore;
};

const getSharedVector = () => {
  if (!sharedVector) {
    sharedVector = new PgVector({
      connectionString: DATABASE_URL,
      schemaName: "public",
    });
  }
  return sharedVector;
};

export { getSharedStore, getSharedVector };