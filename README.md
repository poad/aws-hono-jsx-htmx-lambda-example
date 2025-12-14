# Example by Hono/htmx/AWS Lambda/DynamoDB

This is an example project demonstrating the use of [Hono](https://hono.dev/),
[htmx](https://htmx.org/), AWS Lambda, and DynamoDB.
It uses the AWS Cloud Development Kit (CDK) to define cloud infrastructure
in code and provision it through AWS CloudFormation.

## Deploy

To deploy this example, ensure you have the AWS CDK installed and configured.
Then, run the following commands:

```bash
pnpm install
npx -y aws-cdk@latest bootstrap
npx -y aws-cdk@latest deploy
```

You can access to Lambda Function URL from AWS Management Console.

## AWS Resources

This example provisions the following AWS resources:

| Resource | Type | Name |
| -------- | ---- | ---- |
| CDK Stack | AWS CloudFormation | `aws-hono-jsx-htmx-lambda-example-stack` |
| Lambda Function | AWS Lambda | `aws-hono-jsx-htmx-lambda` |
| DynamoDB Table | Amazon DynamoDB | `aws-hono-jsx-htmx-lambda-example-todo` |
| IAM Role | AWS Identity and Access Management (IAM) | `aws-hono-jsx-htmx-lambda-role` |
| CloudWatch Log Group | Amazon CloudWatch | `/aws/lambda/aws-hono-jsx-htmx-lambda` |
| Lambda Function URL | AWS Lambda | aws-hono-jsx-htmx-lambda Function URL |

## Clean Up

To delete the AWS resources created by this example, run the following command:

```bash
npx -y aws-cdk@latest destroy -f
```

## Refernce

- [Hono + htmx + Cloudflareは新しいスタック](https://zenn.dev/yusukebe/articles/e8ff26c8507799)

## License

This project is licensed under the MIT License.
See the [LICENSE](LICENSE) file for details.
