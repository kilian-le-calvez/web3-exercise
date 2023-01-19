const axios = require('axios');
const niceList = require('../utils/niceList.json');
const MerkleTree = require('../utils/MerkleTree');

const serverUrl = 'http://localhost:1225';

async function main() {
  var leaves = [];
  var tree = new MerkleTree(niceList);

  // TODO: how do we prove to the server we're on the nice list?
  const name = "Alexander Franey";
  const indexName = niceList.findIndex((value, index) => {
    if (name == value)
      return true;
  });
  const proof = tree.getProof(indexName);
  console.log(proof);

  const { data: gift } = await axios.post(`${serverUrl}/gift`, {
    // TODO: add request body parameters here!
    proof: proof,
    leaf: name,
  });

  console.log({ gift });
}

main();