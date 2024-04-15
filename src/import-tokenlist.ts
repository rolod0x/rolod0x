#!/usr/bin/env tsx

import * as fs from 'fs';

import _ from 'lodash';
import fetch from 'node-fetch';

const CHAINS_URL = 'https://chainid.network/chains.json';

type Chain = {
  name: string;
  chainId: number;
};

const response = await fetch(CHAINS_URL);
const chainList = (await response.json()) as Chain[];
const chainsById = _.keyBy(chainList, 'chainId');
// const chains = JSON.parse(fs.readFileSync('./src/assets/chainIds.json', 'utf8'));

const json = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));

for (const tokenData of json.tokens) {
  const { address, name, chainId } = tokenData;
  const chainName = chainsById[chainId].name || `chain id ${chainId}`;
  const chainSuffix = chainName ? ` (${chainName})` : '';
  console.log(address, name + chainSuffix);
}
