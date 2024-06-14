# How many fediverse servers know about my server?

This repo contains a node.js script that accompanies a [blog post](https://stefanbohacek.com/blog/how-many-fediverse-servers-know-about-my-server/) where I explored how well-connected my self-hosted, single-user instance is across the fediverse, using data collected by fedilist.com.

For more details, see the documented of the `instance/peers` endpoint on [docs.joinmastodon.org](https://docs.joinmastodon.org/methods/instance/#peers).

## How to use the script

1. Make sure you have [node.js](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs) installed.
2. Download the latest list of instances from http://demo.fedilist.com/instance and save it as `servers.csv`.
3. Install dependencies with `npm install`.
4. Run the script that fetches the peer data with `npm start` and the name of the domain you're checking peers for, example:

```sh
npm start example.social
```

Note that depending on the number of servers and your computer's and network's performance, the time needed to fetch the data can vary.

Also note that the script processes the server list in batches, and is able to resume work if it gets interrupted. It is not recommended to have the `servers.csv` file open as that might cause the script to break. If you'd like to see results while you wait, you can always make a copy of the file and open it instead.
