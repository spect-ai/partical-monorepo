import { ethers } from 'ethers';
import { EntityABI } from '../constants/abi';
import OnChainEntityFactory from './OnChainEntityFactory';

export default class OnChainEntity {
  static contract: any;

  static initContract(address: string) {
    const provider = new ethers.providers.Web3Provider(
      (window as any).ethereum
    );
    OnChainEntity.contract = new ethers.Contract(
      address,
      EntityABI.abi,
      provider.getSigner()
    );
  }

  static async create(uri: string) {
    console.log(uri);
    console.log(OnChainEntityFactory);

    return await OnChainEntityFactory.createEntity(uri);
  }

  static async update(uri: string) {
    const tx = await OnChainEntity.contract.updateuri(uri);
    return tx.wait();
  }

  static async mintAccessToken(userAddress: string) {
    const tx = await OnChainEntity.contract.mintAccessToken(userAddress, 0, 1);
    return tx.wait();
  }
}
