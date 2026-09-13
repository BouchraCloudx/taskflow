# Zippe automatiquement chaque fichier Python
data "archive_file" "create_task" {
  type        = "zip"
  source_file = "${path.module}/lambda_code/create_task.py"
  output_path = "${path.module}/lambda_code/create_task.zip"
  output_file_mode = "0666"
}

data "archive_file" "list_task" {
  type        = "zip"
  source_file = "${path.module}/lambda_code/list_task.py"
  output_path = "${path.module}/lambda_code/list_task.zip"
  output_file_mode = "0666"
}

data "archive_file" "update_task" {
  type        = "zip"
  source_file = "${path.module}/lambda_code/update_task.py"
  output_path = "${path.module}/lambda_code/update_task.zip"
  output_file_mode = "0666"
}

data "archive_file" "delete_task" {
  type        = "zip"
  source_file = "${path.module}/lambda_code/delete_task.py"
  output_path = "${path.module}/lambda_code/delete_task.zip"
  output_file_mode = "0666"
}

# Fonction create_task
resource "aws_lambda_function" "create_task" {
  function_name    = "${var.project_name}-create-task"
  role             = aws_iam_role.lambda_role.arn
  handler          = "create_task.lambda_handler"
  runtime          = "python3.12"
  filename         = data.archive_file.create_task.output_path
  source_code_hash = data.archive_file.create_task.output_base64sha256
  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.tasks.name
    }
  }
}

# Fonction list_task
resource "aws_lambda_function" "list_task" {
  function_name    = "${var.project_name}-list-tasks"
  role             = aws_iam_role.lambda_role.arn
  handler          = "list_task.lambda_handler"
  runtime          = "python3.12"
  filename         = data.archive_file.list_task.output_path
  source_code_hash = data.archive_file.list_task.output_base64sha256
  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.tasks.name
    }
  }
}

# Fonction update_task
resource "aws_lambda_function" "update_task" {
  function_name    = "${var.project_name}-update-task"
  role             = aws_iam_role.lambda_role.arn
  handler          = "update_task.lambda_handler"
  runtime          = "python3.12"
  filename         = data.archive_file.update_task.output_path
  source_code_hash = data.archive_file.update_task.output_base64sha256
  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.tasks.name
    }
  }
}

# Fonction delete_task
resource "aws_lambda_function" "delete_task" {
  function_name    = "${var.project_name}-delete-task"
  role             = aws_iam_role.lambda_role.arn
  handler          = "delete_task.lambda_handler"
  runtime          = "python3.12"
  filename         = data.archive_file.delete_task.output_path
  source_code_hash = data.archive_file.delete_task.output_base64sha256
  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.tasks.name
    }
  }
}