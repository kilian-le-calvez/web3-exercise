import { useEffect, useState } from 'react'
import { CircularProgress, CircularProgressLabel, Text } from '@chakra-ui/react'
import { getStatGasUsed, getColorGasUsed, getStatGasChange } from './utils';
import { getLatestBlock, getBlock, getListBlock } from './Service';
import { element } from 'prop-types';
import './App.css';

import React from 'react'

function BlockListRow({navigate, listBlock, symbol}) {
  return (
    <div className='row paddingVertical50px'>
        {listBlock.map((elem, index) => {
            const statGasUsed = getStatGasUsed(elem);
            const colorGasUsed = getColorGasUsed(statGasUsed);
            return (
                <div onClick={() => {navigate(elem.number)}} className='col navigate'>
                    { symbol === "+" ?
                        <div>N {symbol} {index + 1}</div>
                        :
                        <div>N {symbol} {(index - 4) * -1}</div> }
                    <div className='sizedBox10px'></div>
                    <CircularProgress value={statGasUsed} size='100px' color={colorGasUsed} thickness={'10px'}>
                            <CircularProgressLabel top={'40%'}>{Math.round(statGasUsed)}%
                            </CircularProgressLabel>
                            <div className='col'>
                                <div className='sizedBox10px'></div>
                                <Text fontSize={'sm'}>{elem.number}</Text>
                            </div>
                    </CircularProgress>
                </div>
            )
        })}
    </div>
  )
}

function BlockList({navigate, actualBlockNumber}) {
    const [listBlock, setListBlock] = useState([]);

    useEffect(() => {
        getListBlock(actualBlockNumber).then((res) => {
            console.log(res)
            setListBlock(res);
        })
    }, [actualBlockNumber]);

    return (
        <div className='row spaceAround paddingVertical50px'>
            <div className='col'>
                <div>Previous blocks</div>
                <BlockListRow navigate={navigate} listBlock={listBlock.slice(0, 4)} symbol={"-"}></BlockListRow>
            </div>
            <div className='col'>
                <div>Next blocks</div>
                <BlockListRow navigate={navigate} listBlock={listBlock.slice(4, 8)} symbol={"+"}></BlockListRow>
            </div>
        </div>
    )
}

export default BlockList