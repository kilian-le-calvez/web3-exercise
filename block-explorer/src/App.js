import { useEffect, useState } from 'react';
import { ChakraProvider, Switch, FormControl, FormLabel } from '@chakra-ui/react';
import { getLatestBlock, getBlock, getBlockNumber } from './Service';
import { createBlockObject } from './utils';

import './App.css';
import BlockCard from './BlockCard';
import BlockList from './BlockList';

let intervalId;

function App() {
  const [blockNumber, setBlockNumber] = useState(0);
  const [latestBlockNumber, setLatestBlockNumber] = useState(0);
  const [actualBlock, setActualBlock] = useState(createBlockObject());
  const [beforeBlock, setBeforeBlock] = useState(createBlockObject());
  const [isLive, setIsLive] = useState(false);

  function refreshLive() {
    console.log("refreshLive")
    getLatestBlock().then((res) => {
      setBlockNumber(res["number"]);
      setActualBlock(createBlockObject(res["number"], res["gasLimit"], res["gasUsed"], res["transactions"]));
      getBlock(res["number"] - 1).then((res) => {
        setBeforeBlock(createBlockObject(res["number"], res["gasLimit"], res["gasUsed"], res["transactions"]))
      });
    });
  }

  function goLive() {
    console.log("GO LIVE")
    if (!intervalId) {
      intervalId = setInterval(refreshLive, 1000);
    }
  }

  function stopLive() {
    console.log("stop" + intervalId);
    clearInterval(intervalId);
    intervalId = null;
  }

  useEffect(() => {
    if (isLive) {
      console.log("START LIVE")
      goLive();
    } else {
      console.log("STOP LIVE")
      stopLive();
    }
  }, [isLive])

  useEffect(() => {
    getLatestBlock().then((res) => {
      setBlockNumber(res["number"]);
      setActualBlock(createBlockObject(res["number"], res["gasLimit"], res["gasUsed"], res["transactions"]));
      getBlock(res["number"] - 1).then((res) => {
        setBeforeBlock(createBlockObject(res["number"], res["gasLimit"], res["gasUsed"], res["transactions"]))
      });
    });
  }, []);

  useEffect(() => {
    getBlock(blockNumber).then((res) => {
      setActualBlock(createBlockObject(res["number"], res["gasLimit"], res["gasUsed"], res["transactions"]));
      getBlock(res["number"] - 1).then((res) => {
        setBeforeBlock(createBlockObject(res["number"], res["gasLimit"], res["gasUsed"], res["transactions"]))
      });
    });
    getBlockNumber().then((res) => {
      setLatestBlockNumber(res);
    })
  }, [blockNumber]);

  return (
    <div>
      <ChakraProvider>
        <button onClick={() => {setBlockNumber(blockNumber - 1)}}>Previous</button>
        <BlockCard latestBlockNumber={latestBlockNumber} blockNumber={blockNumber} actualBlock={actualBlock} beforeBlock={beforeBlock}></BlockCard>
        <div className='sizedBox10px'></div>
        <div className='App'>
          <div>Live update</div>
          <Switch isChecked={isLive} onChange={(event) => {setIsLive(event.target.checked)}} id='email-alerts' />
        </div>
        {/* <div className="App">Transactions Number: {actualBlock?.transactions.length}</div> */}
        <BlockList navigate={(blockNumber) => {setIsLive(false); setBlockNumber(blockNumber)}} actualBlockNumber={actualBlock.number}></BlockList>
      </ChakraProvider>
    </div>
    );
}

export default App;
