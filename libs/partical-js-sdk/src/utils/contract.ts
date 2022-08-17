// import { ethers } from 'ethers';

// // export function getContract(contractAddress: string, abi: any): any {
// //   const provider = new ethers.providers.Web3Provider((window as any).ethereum);
// //   return new ethers.Contract(contractAddress, abi, provider.getSigner());
// // }

// export async function createEntity(
//   uri: string,
//   factoryAddress: string,
//   factoryABI: any
// ) {
//   const contract = getContract(factoryAddress, factoryABI);

//   const tx = await contract.createEntity(uri);
//   return tx.wait();
// }

// export async function updateEntityUri(
//   entityAddress: string,
//   uri: string,
//   entityABI: any
// ) {
//   const contract = getContract(entityAddress, entityABI);

//   const tx = await contract.updateuri(uri);
//   return tx.wait();
// }

// export async function mintAccessToken(
//   entityAddress: string,
//   userAddress: string,
//   entityABI: any
// ) {
//   const contract = getContract(entityAddress, entityABI);
//   console.log({ entityAddress, userAddress });
//   const tx = await contract.mintAccessToken(userAddress, 0, 1);
//   return tx.wait();
// }
