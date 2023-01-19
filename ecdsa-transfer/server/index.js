const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const secp = require ("ethereum-cryptography/secp256k1");
const { hexToBytes, toHex, utf8ToBytes } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

app.use(cors());
app.use(express.json());

const balances = {
  "04baf1633232c98f88153b7754793e327242b00561afcdae063962838792ee20a2d34e998c2bafcaa471e1a890d247ff9a049baabf5020a0c444ef55479b05c31c": 100,
  // 3657603ee4d368219dfdf47bb782dda695498fcc7e52f51a162b4c42ce7531e3
  "040d5ae8a8ae2c43f232485ebedd4fae5b33fd1f65179d706ac9ebcf32728f44d2b06f907d6e6807c16fa74d54e244c431615f14039b032f2afa42072590e56044": 50,
  // b509ba1af1f6704d2ba743f3e7a2533d15c74c89d8d73bce266d6469ed79d10b
  "049bd4185465368acf90c11bbe32b4b754b3cfed507ca0ca9ddf51be44f192fbba7cd15662d027c5f0bbd3ef8425941d9b7f649dd6e9af30b24483cc326e0ed97a": 75,
  // 9a03d32e660fa54d4f40183369952687cd0099e2b2039374e759eb147b753c12
};

function hashMessage(msg) {
  return keccak256(utf8ToBytes(msg));
}

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { signature, recoveryBit, recipient, amount } = req.body;

  const sender = toHex(secp.recoverPublicKey(hashMessage("signature"), signature, recoveryBit));
  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
