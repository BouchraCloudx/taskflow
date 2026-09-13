from lambda_function import lambda_handler
import json

test_event = {
    'body': json.dumps({
        'userId': 'test-user-123',
        'taskId': '5bef0fbf-588c-49ef-b46f-882007494e92',
        'status': 'done'
    })
}

result = lambda_handler(test_event, None)
print(result)