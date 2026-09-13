from lambda_function import lambda_handler

test_event = {
    'queryStringParameters': {'userId': 'test-user-123'}
}

result = lambda_handler(test_event, None)
print(result)