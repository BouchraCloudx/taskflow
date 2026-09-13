import json
import boto3
import uuid
from datetime import datetime, timezone

# Connexion à DynamoDB
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('taskflow-tasks')

def lambda_handler(event, context):
    try:
        # Récupération des données envoyées par le frontend
        body = json.loads(event['body'])
        title = body.get('title')

        # Validation basique
        if not title:
            return {
                'statusCode': 400,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Le champ "title" est requis'})
            }

        # Récupération de l'ID utilisateur (fourni par Cognito via API Gateway plus tard)
        # Pour l'instant, en test, on le récupère depuis le body directement
        user_id = body.get('userId', 'test-user')

        # Création de la tâche
        task_id = str(uuid.uuid4())
        item = {
            'userId': user_id,
            'taskId': task_id,
            'title': title,
            'status': 'pending',
            'createdAt': datetime.now(timezone.utc).isoformat()
        }

        table.put_item(Item=item)

        return {
            'statusCode': 201,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps(item)
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }