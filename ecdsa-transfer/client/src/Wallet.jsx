import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import { hexToBytes, toHex } from "ethereum-cryptography/utils";
import { useState } from "react";

function Wallet({ address, setAddress, privateKey, setPrivateKey, balance, setBalance }) {
  const [error, setError] = useState();

  async function onChange(evt) {
    const privateKey = evt.target.value;
    setError();
    setPrivateKey(privateKey);

    console.log(privateKey.length);
    var tmpAddress;
    try {
      tmpAddress = toHex(secp.getPublicKey(hexToBytes(privateKey)));
      setAddress(tmpAddress);
  
    } catch (e) {
      setError("Invalid private key");
      setAddress();
    }
    
    if (tmpAddress) {
      console.log("WORKING");
      console.log(tmpAddress);
      const {
        data: { balance },
      } = await server.get(`balance/${tmpAddress}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Wallet Private Key
        <input placeholder="Type a PrivateKey" value={privateKey} onChange={onChange}></input>
      </label>

      <div>Address: {error != null ? error : address?.slice(0, 10)}...</div>
      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
