import fetch from 'node-fetch';
import { PublicKey } from '@solana/web3.js';

// Configuration
const HELIUS_API_KEY = '77e76692-d441-4212-96ea-79b93c83a2ad'; // Replace with your actual key
const BASE_URL = 'https://api.helius.xyz/v0/';

// Test with these addresses first
const TEST_ADDRESS = 'vines1vzrYbzLMRdu58ou5XTby4qAqVRLmqo36NKPTg'; // Known good devnet address

function validateAddress(address) {
  try {
    new PublicKey(address);
    return true;
  } catch (error) {
    console.error(`Invalid address: ${address}`);
    console.error('Tip: Solana addresses are base58 encoded and typically 32-44 chars long');
    return false;
  }
}

async function fetchTransactions(address) {
  if (!validateAddress(address)) return [];
  
  const url = `${BASE_URL}addresses/${address}/transactions?api-key=${HELIUS_API_KEY}&limit=5`;
  
  try {
    console.log(`Fetching transactions for ${address}...`);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('API request failed:', error.message);
    return [];
  }
}

async function main() {
  console.log('Testing with valid address:', TEST_ADDRESS);
  const transactions = await fetchTransactions(TEST_ADDRESS);
  
  console.log(`\nResults for ${TEST_ADDRESS}:`);
  console.log(`Found ${transactions.length} transactions`);
  
  if (transactions.length > 0) {
    console.log('Latest transaction:', {
      signature: transactions[0].signature,
      date: new Date(transactions[0].blockTime * 1000).toISOString()
    });
  }
}

main();