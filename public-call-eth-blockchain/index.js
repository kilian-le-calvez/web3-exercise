const axios = require('axios');

// copy-paste your URL provided in your Alchemy.com dashboard
const ALCHEMY_URL = "https://eth-goerli.g.alchemy.com/v2/1OCQxKzC4nEXKNrpBI9uNsI9EvwDcgTw";

axios.post(ALCHEMY_URL, {
  jsonrpc: "2.0",
  id: 1,
  method: "eth_getTransactionCount",
  params: [
    "0xdc45fbc451c22f8a1c37c4d9bf37fa6ddf86269e", // block 46147
    "16341951"  // retrieve the full transaction object in transactions array
  ]
}).then((response) => {
  console.log(response.data.result);
});