variable "aws_region" {
  description = "Région AWS utilisée pour toutes les ressources"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Préfixe utilisé pour nommer toutes les ressources"
  type        = string
  default     = "taskflow-tf"
}
variable "alert_email" {
  description = "Email pour recevoir les alertes CloudWatch"
  type        = string
}