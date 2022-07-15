import { ethers } from 'ethers';

type Props = {
  factoryAddress: string;
  factoryABI: any;
  entityABI: any;
};

export default function useContract({
  factoryAddress,
  factoryABI,
  entityABI,
}: Props) {
  function getContract(contractAddress: string, abi: any) {
    const provider = new ethers.providers.Web3Provider(
      (window as any).ethereum
    );
    return new ethers.Contract(contractAddress, abi, provider.getSigner());
  }

  async function createEntity(uri: string) {
    const contract = getContract(factoryAddress, factoryABI);

    const tx = await contract.createEntity(uri);
    return tx.wait();
  }

  async function updateEntityUri(entityAddress: string, uri: string) {
    const contract = getContract(entityAddress, entityABI);

    const tx = await contract.updateuri(uri);
    return tx.wait();
  }

  return {
    createEntity,
    updateEntityUri,
  };
}
