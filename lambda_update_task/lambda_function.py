import json
import boto3

dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
table = dynamodb.Table('taskflow-tasks')

def lambda_handler(event, context):
    try:
        body = json.loads(event['body'])
        user_id = body.get('userId')
        task_id = body.get('taskId')
        new_status = body.get('status')

        if not user_id or not task_id or not new_status:
            return {
                'statusCode': 400,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'userId, taskId et status sont requis'})
            }

        table.update_item(
            Key={'userId': user_id, 'taskId': task_id},
            UpdateExpression='SET #s = :status',
            ExpressionAttributeNames={'#s': 'status'},
            ExpressionAttributeValues={':status': new_status}
        )

        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'message': 'Tâche mise à jour'})
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }