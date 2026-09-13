import json
import boto3
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
table = dynamodb.Table('taskflow-tasks')

def lambda_handler(event, context):
    try:
        # Récupération du userId (viendra de Cognito plus tard, en test on le passe en query param)
        user_id = event.get('queryStringParameters', {}).get('userId', 'test-user-123')

        # Récupère uniquement les tâches de cet utilisateur
        response = table.query(
            KeyConditionExpression=Key('userId').eq(user_id)
        )

        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps(response['Items'])
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }