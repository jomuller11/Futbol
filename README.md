# Hello World — Serverless App

This repository contains a minimal serverless demo (AppSync + DynamoDB) with a static frontend and a CI/CD workflow.

## Local development

Start the local static server and open the demo at http://localhost:8080:

```powershell
npm ci
npm start
```

Build the production artifacts into `dist/`:

```bash
npm run build
# clean build output
npm run clean
```

To serve the built files locally (optional):

```bash
# the `start` script serves `frontend/` by default; to serve `dist/` update serve-static.js or copy files
npm start
```

## CI/CD (GitHub Actions)

The workflow is at `.github/workflows/deploy.yml`. It performs these steps on `push` to `main` or via manual dispatch:

- Validates required AWS secrets are present.
- Installs dependencies and runs `npm run build`.
- Syncs `dist/` to an S3 bucket (optional).
- Can create a CloudFront distribution + OAI (if `CLOUDFRONT_DISTRIBUTION_ID` not provided).
- Deploys the CloudFormation template at `aws/appsync-dynamo-template.yaml` as the `hello-appsync` stack.
- Saves CloudFormation stack outputs to an artifact and comments PRs with the deployed endpoint and API key.

## Required repository secrets

Set these in **Settings → Secrets and variables → Actions** before running the workflow:

- `AWS_ACCESS_KEY_ID` (required)
- `AWS_SECRET_ACCESS_KEY` (required)
- `AWS_REGION` (required, e.g., `us-east-1`)
- `S3_BUCKET` (optional — bucket to host static site; workflow creates/configures it if empty)
- `CLOUDFRONT_DISTRIBUTION_ID` (optional — if provided, used for invalidation; if empty, workflow may create a distribution)

Notes:
- The workflow will create or update the `hello-appsync` CloudFormation stack; it requires `CAPABILITY_NAMED_IAM`.
- If you want a private S3 bucket with CloudFront OAI (recommended), provide an empty `CLOUDFRONT_DISTRIBUTION_ID` and the workflow will create a distribution and restrict the bucket to CloudFront.

## Next steps you might want

- Configure ESLint and add `npm run lint`.
- Add unit/end-to-end tests and a workflow job to run them.
- Harden S3/CloudFront security and enable HTTPS with a custom domain.

If you'd like, I can add ESLint and a GitHub Actions validation job next.
