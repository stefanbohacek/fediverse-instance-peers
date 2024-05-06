import fs from "fs";
import { stringify } from "csv-stringify/sync";

export default async (peerDomain, columns, data) => {
  console.log("saving...");
  // data.forEach((d) => {
  //   // d.peers = d.peers.join(", ");
  //   d.has_endpoint = d.has_endpoint ? "true" : "false";
  //   d.has_peer = d.has_peer ? "true" : "false";
  //   return d;
  // });

  // data = data.filter((d) => d.server && d.has_endpoint);

  const output = stringify(data, {
    header: true,
    columns,
  });  
  // fs.writeFileSync(`./peers-${peerDomain}.csv`, output);
  fs.writeFileSync(`./servers.csv`, output);
  return true;
};
