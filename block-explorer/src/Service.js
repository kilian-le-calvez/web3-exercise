import { Alchemy, Network } from 'alchemy-sdk';
import { createBlockObject } from './utils';

const settings = {
    apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
    network: Network.ETH_MAINNET,
};
  
  //   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
export const alchemy = new Alchemy(settings);

export async function getBlockNumber() {
  return await alchemy.core.getBlockNumber();
}

export async function getBlock(blockNb) {
    return await alchemy.core.getBlock(blockNb);
}

export async function getLatestBlock() {
    const blockNumber = getBlockNumber();
    return await getBlock(blockNumber);
}
  
export async function getListBlock(blockNumber) {
    if (blockNumber === 0) {
        return [];
    }
    const latestBlockNumber = await getBlockNumber();
    var listBlock = [];
    for (var count = 1; count < 5 && blockNumber + count <= latestBlockNumber; count++) {
        const res = await getBlock(blockNumber + count);
        console.log(blockNumber + count)
        console.log(latestBlockNumber)
        console.log(res)
        const newBlock = createBlockObject(res["number"], res["gasLimit"], res["gasUsed"], res["transactions"]);
        listBlock.push(newBlock);
    }
    for (count = 1; count < 5; count++) {
        const res = await getBlock(blockNumber - count);
        const newBlock = createBlockObject(res["number"], res["gasLimit"], res["gasUsed"], res["transactions"]);
        listBlock.unshift(newBlock);
    }
    return listBlock;
}