import { isDsqlConfigured } from "@/lib/dsql";
import { isDynamoConfigured } from "@/lib/dynamodb";

export type DatabaseBackend = "dsql" | "dynamodb" | "memory";

const preferredBackend = process.env.DATABASE_BACKEND;

export const activeBackend: DatabaseBackend =
  preferredBackend === "dsql" && isDsqlConfigured
    ? "dsql"
    : preferredBackend === "dynamodb" && isDynamoConfigured
      ? "dynamodb"
      : isDynamoConfigured
        ? "dynamodb"
        : isDsqlConfigured
          ? "dsql"
          : "memory";

export const isDemoMode = activeBackend === "memory";
