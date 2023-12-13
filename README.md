# Generate TF from Auth0 Tenant

## Prerequisites

- [Install Auth0 CLI](https://github.com/auth0/auth0-cli)
- Upgrade Terraform Instructions: [Install Terraform](https://developer.hashicorp.com/terraform/downloads)

## Steps

```bash
#
# Source tenant
#
export AUTH0_DOMAIN=-auth0-domain-
export AUTH0_CLIENT_ID=-client-id-
export AUTH0_CLIENT_SECRET=-client-secret-

# Export source tenant as TF code
auth0 tenants use $AUTH0_DOMAIN
auth0 login --domain $AUTH0_DOMAIN --client-id $AUTH0_CLIENT_ID --client-secret $AUTH0_CLIENT_SECRET
auth0 tf generate --output-dir $AUTH0_DOMAIN

# Import existing resource Ids
cd $AUTH0_DOMAIN
./terraform apply

# Check: should show "No changes"
rm auth0_import.tf
./terraform apply

#
# Destination tenants
#

# Clean destination tenant - make sure to update the .env file
node clean.js # <<<=== check .env file settings

# Prepare destination TF folder
DEST_DIR=-a-local-folder-
mkdir $DEST_DIR
cp ./$AUTH0_DOMAIN/*.tf ./$DEST_DIR
cp ./$AUTH0_DOMAIN/terraform ./$DEST_DIR

# Optional: clear terraform state

# Dest tenant #1
export AUTH0_DOMAIN=-auth0-domain-
export AUTH0_CLIENT_ID=-client-id-
export AUTH0_CLIENT_SECRET=-client-secret-

# Dest tenant #2
export AUTH0_DOMAIN=-another-auth0-domain-
export AUTH0_CLIENT_ID=-another-client-id-
export AUTH0_CLIENT_SECRET=-another-client-secret-

auth0 tenants use $AUTH0_DOMAIN
auth0 login --domain $AUTH0_DOMAIN --client-id $AUTH0_CLIENT_ID --client-secret $AUTH0_CLIENT_SECRET

cd $DEST_DIR
./terraform init # optional
./terraform plan
./terraform apply --auto-approve # may need to do this twice

# TODO: modify exported TF code to fix errors
# 

# Clean destination tenant and re-provisioning
./terraform destroy --auto-approve
./terraform apply --auto-approve

```

## Misc

.env file content

```txt
DEST_AUTH0_DOMAIN=-auth0-domain-
DEST_AUTH0_CLIENT_ID=-m2m-app-for-terraform-client-id-
DEST_AUTH0_CLIENT_NAME=-m2m-app-for-terraform-client-name-
DEST_AUTH0_CLIENT_SECRET=-m2m-app-for-terraform-client-secret-
EMPTY_LOCATION=./configs-empty
```
