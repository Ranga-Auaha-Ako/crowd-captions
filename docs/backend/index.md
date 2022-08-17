## Getting Started

### Getting authenticated

To use this tool on your Panopto instance, you'll need a client ID and Secret. To do that, follow the instructions here: https://support.panopto.com/s/article/support-panopto-com-s-article-oauth2-client-setup. You want to create an API Key with the type "Server-side Web Application".

Once you have the client ID and secret, create a `.env` file, and fill it with your credentials and the URL of your hosted Panopto server:

```
panopto_host=https://xxx.xxx.panopto.com
panopto_clientId=xxx
panopto_clientSecret=xxx
```

This should be enough to have things spin up and work in development, so let's move on to:

### Running the project

To start developing, grab your OS-specific version of [Docker](https://www.docker.com/get-started). Then:

1. Open up a terminal in the root directory of the project
2. Run `docker-compose up --build`

Everything should download and configure automatically. Confirm things are working by visiting http://localhost:8000/health. If you see a JSON response telling you you're not authenticated but that the request was successful, you're good to go.

If you'd like to run this detached from your current terminal, just use `docker-compose up -d` instead.

## Testing the project

Think you're ready to submit a pull request? First, make sure your code passes all of the tests. This is also a good time to update any tests that need it, and to create/remove new and redundant tests. To test the project, run:

```
docker-compose run backend npm test
```

## Deployment

This tool is built into a Docker image for deployment on AWS, and uses Terraform for configuration and deployment. Before starting, you will need to fork the repository or download and edit the `terraform.tf.json` file. Update the state management configuration to match the S3 Bucket you use, or remove it if you're just using local storage of Terraform state. You can also update the `aws_region` and `asset_host` variables to match your AWS region and the domain you are hosting the icon library on.

You will also want to configure a terraform.tfvars with your Panopto Host, the domain the server will run on, and the ARN for the AWS Certificate Manager key for that domain. You can also configure the version being deployed, and how many instances of the web server to run concurrently.

    panopto_host="xxxx.xx.panopto.com"
    server_host="your.api.domain.here"
    cert_arn="arn:aws:acm:xxx:12345678912:certificate/xxx
    app_version="1.7.2"
    instances=2

To build the image, run:

```bash
cd deployment
terraform apply # This will create and/or configure the required infrastructure on AWS. Careful! This will add to your bill.
./scripts/deploy.sh # This will build the image and push it to AWS
```

Crowd Captions runs on:

- AWS ECS Fargate + ECR Instances for the REST API
- AWS ALB for load balancing
- AWS RDS for storing data
- AWS Cloudwatch for alerts and monitoring

### With Docker

First, install [Docker Desktop](https://www.docker.com/get-started).

Run `docker compose -f .\docker-compose.prod.yml up`. A NodeJS server with the production build will start and be accessible at http://localhost:3000/.

## Running in production without Terraform

If you plan not to use Terraform to deploy the app, you can easily spin up an instance using the following Docker command:

```
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up
```

It is likely worth having a read over the Terraform configuration files to see what is being deployed in an AWS instance. You will need to provide environment variables for your own database, which are configured in terraform at `deployment/fargate.tf` in `aws_ecs_task_definition.backend_task`.
