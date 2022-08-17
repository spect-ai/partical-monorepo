import SafeServiceClient from '@gnosis.pm/safe-service-client';
import { ethers } from 'ethers';
import EthersAdapter from '@gnosis.pm/safe-ethers-lib';

export class Gnosis {
  // static async getUserSafes(userAddress: string) {
  //   console.log({ userAddress });
  //   const provider = new ethers.providers.Web3Provider(
  //     (window as any).ethereum
  //   );
  //   const safeOwner = provider.getSigner(0);
  //   console.log({ safeOwner });

  //   const ethAdapter = new EthersAdapter({
  //     ethers,
  //     signer: safeOwner,
  //   });

  //   const txServiceUrl = 'https://safe-transaction.polygon.gnosis.io/';
  //   const safeService = new SafeServiceClient({ txServiceUrl, ethAdapter });

  //   const res = await safeService.getSafesByOwner(
  //     ethers.utils.getAddress(userAddress)
  //   );
  //   console.log({ res });

  //   return res;
  // }

  // static async getSafeInfo(safeAddress: string) {
  //   console.log({ safeAddress });
  //   const provider = new ethers.providers.Web3Provider(
  //     (window as any).ethereum
  //   );
  //   const safeOwner = provider.getSigner(0);
  //   console.log({ safeOwner });

  //   const ethAdapter = new EthersAdapter({
  //     ethers,
  //     signer: safeOwner,
  //   });

  //   const txServiceUrl = 'https://safe-transaction.polygon.gnosis.io/';
  //   const safeService = new SafeServiceClient({ txServiceUrl, ethAdapter });

  //   const res = await safeService.getSafeInfo(
  //     ethers.utils.getAddress(safeAddress)
  //   );
  //   console.log({ res });

  //   return res;
  // }
}
