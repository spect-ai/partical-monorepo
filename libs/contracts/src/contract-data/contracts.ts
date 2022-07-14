import rinkebyTXN from '../broadcast/Factory.s.sol/4/run-latest.json';
import kovanTXN from '../broadcast/Factory.s.sol/42/run-latest.json';
import optimismKovanTXN from '../broadcast/Factory.s.sol/69/run-latest.json';
import polygonTXN from '../broadcast/Factory.s.sol/137/run-latest.json';
import mumbaiTXN from '../broadcast/Factory.s.sol/80001/run-latest.json';
import localTXN from '../broadcast/Factory.s.sol/31337/run-latest.json';

import FactoryABI from '../out/Factory.sol/Factory.json';
import EntityABI from '../out/Entity.sol/Entity.json';

export function getContractAddress(chainId: string): string {
  switch (chainId) {
    case '4':
      return rinkebyTXN.transactions[0].contractAddress;
    case '42':
      return kovanTXN.transactions[0].contractAddress;
    case '69':
      return optimismKovanTXN.transactions[0].contractAddress;
    case '137':
      return polygonTXN.transactions[0].contractAddress;
    case '80001':
      return mumbaiTXN.transactions[0].contractAddress;
    case '31337':
      return localTXN.transactions[0].contractAddress;
    default:
      throw new Error(`Unknown chainId: ${chainId}`);
  }
}

export function getContractABI(contract: string): any {
  switch (contract) {
    case 'factory':
      return FactoryABI.abi;
    case 'entity':
      return EntityABI.abi;
    default:
      throw new Error(`Unknown contract: ${contract}`);
  }
}
