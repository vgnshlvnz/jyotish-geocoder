# Azure Web App deployment setup (Next.js)

This repo is prepared for Linux Azure Web App deployment with explicit startup, build, and App Service settings.

## 1) Startup command

Set the Web App startup command to:

```bash
bash ./startup.sh
```

`startup.sh` will:
- enforce `NODE_ENV=production`
- use Azure's `PORT` (fallback `8080`)
- run `npm run build` if `.next` is missing
- start Next.js with host/port binding for App Service

## 2) Build settings (App Service)

Apply these app settings (template: `azure.appsettings.template.json`):

- `SCM_DO_BUILD_DURING_DEPLOYMENT=true`
- `ENABLE_ORYX_BUILD=true`
- `WEBSITE_NODE_DEFAULT_VERSION=~22`
- `NODE_ENV=production`
- `NEXT_TELEMETRY_DISABLED=1`

These ensure Oryx runs install/build during deployment and runtime uses Node 22.

## 3) App Service config commands (CLI)

Replace placeholders and run:

```bash
az webapp config appsettings set \
  --resource-group <RESOURCE_GROUP> \
  --name <WEBAPP_NAME> \
  --settings \
    SCM_DO_BUILD_DURING_DEPLOYMENT=true \
    ENABLE_ORYX_BUILD=true \
    WEBSITE_NODE_DEFAULT_VERSION=~22 \
    NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1

az webapp config set \
  --resource-group <RESOURCE_GROUP> \
  --name <WEBAPP_NAME> \
  --startup-file "bash ./startup.sh"
```

## 4) GitHub Actions deployment

The workflow `.github/workflows/main_jyotish-geocoder.yml` is updated to pass startup command explicitly in deploy step.

## 5) Verify after deployment

- `https://<WEBAPP_NAME>.azurewebsites.net` loads successfully
- `Log stream` shows `next start` bound to expected port
- No startup loop or missing build artifacts errors
