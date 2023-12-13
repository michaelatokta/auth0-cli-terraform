const { deploy } = require("auth0-deploy-cli");
const dotenv  = require("dotenv")
const axios  = require("axios")

dotenv.config();

async function doClean() {
  console.log("Getting Auth0 Management API access token...");
  const accessToken = await get_access_token(
    process.env.DEST_AUTH0_DOMAIN,
    process.env.DEST_AUTH0_CLIENT_ID,
    process.env.DEST_AUTH0_CLIENT_SECRET
  );
  console.log("Getting Auth0 Management API access token...done");

  const excludedClients = [process.env.DEST_AUTH0_CLIENT_NAME];

  console.log(`Cleaning tenant '${process.env.DEST_AUTH0_DOMAIN}...`);
  deploy({
    input_file: process.env.EMPTY_LOCATION.concat("/tenant.yaml"),
    config: {
      AUTH0_DOMAIN: process.env.DEST_AUTH0_DOMAIN,
      AUTH0_ACCESS_TOKEN: accessToken,
      AUTH0_ALLOW_DELETE: true,
      AUTH0_EXCLUDED_CLIENTS: excludedClients,
    },
  })
    .then(() => {
      console.log("Tenant configuration wiped successful");
    })
    .catch((err) => {
      console.log("Error when wiping configuration:", err);
    });
}

async function get_access_token(domain, clientId, clientSecret) {
  var options = {
    method: "POST",
    url: `https://${domain}/oauth/token`,
    headers: { "content-type": "application/x-www-form-urlencoded" },
    data: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: `${clientId}`,
      client_secret: `${clientSecret}`,
      audience: `https://${domain}/api/v2/`,
    }),
  };

  const res = await axios.request(options);
  const accessToken = res.data.access_token;

  console.log("New access token received");

  return accessToken;
}

doClean();
