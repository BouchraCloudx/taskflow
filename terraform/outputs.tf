output "dynamodb_table_name" {
  value = aws_dynamodb_table.tasks.name
}

output "cognito_user_pool_id" {
  value = aws_cognito_user_pool.main.id
}

output "cognito_client_id" {
  value = aws_cognito_user_pool_client.app_client.id
}

output "api_url" {
  value = aws_apigatewayv2_api.main.api_endpoint
}
output "website_url" {
  value = aws_s3_bucket_website_configuration.frontend.website_endpoint
}

output "s3_bucket_name" {
  value = aws_s3_bucket.frontend.bucket
}





