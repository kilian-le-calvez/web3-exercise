import { useEffect, useState } from 'react';
import {
  Stat, StatLabel, StatNumber, StatHelpText, StatArrow,
  CircularProgress, CircularProgressLabel,
  CardBody, Card, Text
} from '@chakra-ui/react'
import { getStatGasUsed, getColorGasUsed, getStatGasChange } from './utils';
import './App.css';
import { getBlockNumber } from './Service';

function BlockCard({latestBlockNumber, actualBlock, beforeBlock}) {
  const [gasUsed, setGasUsed] = useState(0);
  const [colorGasUsed, setColorGasUsed] = useState(0);

  useEffect(() => {
    setGasUsed(getStatGasUsed(actualBlock));
    setColorGasUsed(getColorGasUsed(gasUsed));
  }, [actualBlock, beforeBlock])

  return (
    <Card align={'center'}>
      <CardBody>
        {
          actualBlock.number - latestBlockNumber === 0 ?
          <Text fontSize={'3xl'} textAlign={'center'}>Latest block</Text>
          :
          <Text fontSize={'3xl'} textAlign={'center'}>Block {actualBlock.number - latestBlockNumber}</Text>
        }
        <div className='row'>
          <CircularProgress value={gasUsed} size='200px' color={colorGasUsed} thickness={'10px'}>
            <CircularProgressLabel>{Math.round(gasUsed)}%
              <Text fontSize={'sm'}>of gas limit</Text>
            </CircularProgressLabel>
          </CircularProgress>
          <Stat>
            <StatLabel>Block Number</StatLabel>
            <StatNumber>{actualBlock.number}</StatNumber>
            <StatLabel>Gas used</StatLabel>
            <StatNumber>{actualBlock.gasUsed / 1000000} M</StatNumber>
            <StatHelpText>
              {beforeBlock.gasUsed < actualBlock.gasUsed ? 
                <StatArrow type='increase' />
              :
                <StatArrow type='decrease' />
              }
              {getStatGasChange(actualBlock, beforeBlock).toPrecision(4)}%
            </StatHelpText>
          </Stat>
        </div>
      </CardBody>
    </Card>
  )
}

export default BlockCard