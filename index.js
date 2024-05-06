import fs from "fs";
import { parse } from "csv-parse/sync";
import saveData from "./modules/saveData.js";
import sendRequest from "./modules/splitArray.js";
import splitArray from "./modules/splitArray.js";

const args = process.argv.slice(2);

if (!args || args.length !== 1) {
  console.log("usage: 'npm start example.social'");
} else {
  const peerDomain = args[0];
  const content = fs.readFileSync("./servers.csv");
  const servers = parse(content, { bom: true, relax_column_count: true });

  servers[0][7] = "has_endpoint";
  servers[0][8] = "has_peer";

  const columns = servers.shift();
  // console.log(columns);

  const serverCount = (servers.length - 1).toLocaleString();
  const batchSize = 10;
  const batches = splitArray(servers, batchSize);
  const batchCount = batches.length.toLocaleString();

  console.log(
    `found ${serverCount} server(s), splitting into ${batchCount} batche(s)...`
  );

  let globalIndex = 0;
  let batchIndex = 0;

  for (const serverBatch of batches) {
    batchIndex++;
    console.log(`processing batch ${batchIndex + 1}/${batchCount}...`);
    try {
      const requests = serverBatch
        .slice(0, serverBatch.length)
        .map(async (server) => {
          const serverInfo = {
            server: server[0],
            software: server[2],
            user_count: server[3],
            has_endpoint: false,
            response: null,
          };

          if (!["wordpress"].includes(server[2])) {
            // skip software that is known not to have the /instance/peers endpoint (yet)
            if (!server[7]){
              try {
                console.log(
                  `fetching from https://${server[0]}/api/v1/instance/peers ...`
                );
    
                const response = await fetch(
                  `https://${server[0]}/api/v1/instance/peers`,
                  {
                    signal: AbortSignal.timeout(10 /* minutes */ * 60 * 1000),
                  }
                );
                server[7] = response.status === 200 ? "true" : "false";
                const respJson = await response.json();
                server[8] =
                  respJson && respJson.includes && respJson.includes(peerDomain)
                    ? "true"
                    : "false";
              } catch (error) {
                console.log(error);
                server[7] = "false";
              }
            } else {
              console.log(`skipping ${server[0]} ...`);
            }
          }
          return serverInfo;
        });

      await Promise.all(requests);
      await saveData(peerDomain, columns, servers);
    } catch (errors) {
      console.log(errors);
    }
  }

  await saveData(peerDomain, columns, servers);
  console.log("done");
}
