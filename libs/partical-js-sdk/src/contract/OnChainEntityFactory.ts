import { ethers } from 'ethers';
import { contractAddress } from '../constants/address';
import { FactoryABI } from '../constants/abi';

export default class OnChainEntityFactory {
  static contract: any;

  static initContract() {
    const provider = new ethers.providers.Web3Provider(
      (window as any).ethereum
    );
    OnChainEntityFactory.contract = new ethers.Contract(
      contractAddress,
      FactoryABI.abi,
      provider.getSigner()
    );
  }

  static async createEntity(uri: string) {
    const tx = await OnChainEntityFactory.contract.createEntity(uri);
    return tx.wait();
  }
}
