import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

export const isDynamoConfigured = Boolean(
  process.env.AWS_REGION &&
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY &&
    process.env.DYNAMODB_TABLE_NAME,
);

const client = isDynamoConfigured
  ? new DynamoDBClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
      },
    })
  : null;

export const dynamoDb = client ? DynamoDBDocumentClient.from(client) : null;
export const tableName = process.env.DYNAMODB_TABLE_NAME || "tradeflow-leads";
