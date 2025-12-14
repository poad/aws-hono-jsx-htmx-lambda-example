import { Logger } from '@aws-lambda-powertools/logger';
import { ConditionalCheckFailedException, DynamoDB } from '@aws-sdk/client-dynamodb';
import { DeleteCommand, DynamoDBDocumentClient, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';

const logger = new Logger();

const dynamoClient = new DynamoDB({
});
const docClient = DynamoDBDocumentClient.from(dynamoClient);

const tableName = process.env.TABLE_NAME || 'aws-hono-jsx-htmx-lambda-example';

async function all<T>(): Promise<T[]> {
  const response = await docClient.send(new ScanCommand({
    TableName: tableName,
  }));
  if (response.Count === 0 || response.Items === undefined) {
    return [];
  }
  return response.Items.map((item) => item as T);
}

const put = async (item: {
  title: string
  id: string,
  expire: number,
}) => {
  try {
    await docClient.send(new PutCommand({
      TableName: tableName,
      Item: item,
      ConditionExpression: 'attribute_not_exists(id)',
    }));
    logger.info('アイテムの作成に成功しました');
    return { success: true };
  } catch (error) {
    if (error instanceof ConditionalCheckFailedException) {
      logger.warn('IDが既に存在します');
      return { success: false, reason: 'already_exists' };
    }

    // または name プロパティで判定（JavaScriptの場合）
    if (error && typeof error === 'object' && 'name' in error) {
      if (error.name === 'ConditionalCheckFailedException') {
        logger.warn('IDが既に存在します');
        return { success: false, reason: 'already_exists' };
      }
    }
    logger.error('アイテムの作成に失敗しました');
    throw error;
  }
};

const deleteItem = async (id: string) => {
  try {
    await docClient.send(new DeleteCommand({
      TableName: tableName,
      Key: { id },
    }));
    logger.info('アイテムの削除に成功しました');
    return { success: true };
  } catch (error) {
    logger.error('アイテムの削除に失敗しました');
    throw error;
  }
};

export {
  all,
  put,
  deleteItem,
};
