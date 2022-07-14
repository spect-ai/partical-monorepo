import { CeramicClient } from '@ceramicnetwork/http-client';
import LitJsSdk from 'lit-js-sdk';
import { storeMetadata } from '.';
import { EntityABI } from '../constants/abi';
import { updateEntityUri } from './contract';
import { authenticateCeramic, createStream } from './stream';

const client = new LitJsSdk.LitNodeClient();
const chain = 'rinkeby';
const standardContractType = 'ERC1155';

class Lit {
  private litNodeClient: any;

  async connect() {
    await client.connect();
    this.litNodeClient = client;
  }

  async initializeDatastore(
    message: string,
    contractAddress: string
  ): Promise<
    | {
        encryptedSymmetricKey: string;
        streamId: string;
        url: string;
      }
    | undefined
  > {
    const ceramic = new CeramicClient('http://localhost:7007');

    const accessControlConditions = [
      {
        contractAddress,
        standardContractType,
        chain,
        method: 'balanceOf',
        parameters: [':userAddress', '0'],
        returnValueTest: {
          comparator: '>',
          value: '0',
        },
      },
    ];
    try {
      if (!this.litNodeClient) {
        await this.connect();
      }

      const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
      const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(
        message
      );

      console.log({ symmetricKey });
      await authenticateCeramic(symmetricKey, ceramic);
      const streamId = await createStream(
        {
          contractAddress,
          appData: [],
        },
        ceramic
      );

      const encryptedSymmetricKey = await this.litNodeClient.saveEncryptionKey({
        accessControlConditions,
        symmetricKey,
        authSig,
        chain,
      });

      const url = await storeMetadata(encryptedSymmetricKey, streamId);

      await updateEntityUri(contractAddress, url, EntityABI.abi);

      return {
        encryptedSymmetricKey: LitJsSdk.uint8arrayToString(
          encryptedSymmetricKey,
          'base16'
        ),
        url,
        streamId,
      };
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }
}

export default new Lit();
