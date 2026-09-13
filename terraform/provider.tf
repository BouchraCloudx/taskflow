terraform {
  required_version = ">= 1.9"

    backend "s3" {
    bucket         = "taskflow-tf-state-bush"
    key            = "taskflow/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "taskflow-tf-lock"
    encrypt        = true
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.4"
    }
  }
}

provider "aws" {
  region = var.aws_region
}