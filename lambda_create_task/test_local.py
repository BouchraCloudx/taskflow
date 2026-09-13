from lambda_function import lambda_handler
import json

test_event = {
    'body': json.dumps({
        'title': 'Réviser Terraform',
        'userId': 'test-user-123'
    })
}

result = lambda_handler(test_event, None)
print(json.dumps(result, indent=2))