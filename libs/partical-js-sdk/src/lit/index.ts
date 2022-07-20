// eslint-disable-next-line @typescript-eslint/no-var-requires
const LitJsSdk = require('lit-js-sdk');

const client = new LitJsSdk.LitNodeClient();
const standardContractType = 'ERC1155';
const chain = 'polygon';

export default class Lit {
  static litNodeClient: any;
  static authSig: any;

  static async connect() {
    if (!this.litNodeClient) {
      await client.connect();
      Lit.litNodeClient = client;
    }
  }

  static async checkAndSignAuthMessage(message: string): Promise<any> {
    console.log({ message });

    this.authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
    const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(
      message
    );
    return { encryptedString, symmetricKey };
  }

  static async descryptKey(
    encryptedSymmetricKey: string,
    entityAddress: string
  ): Promise<Uint8Array> {
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
    console.log({ authSig });
    const evmContractConditions = [
      {
        contractAddress: entityAddress,
        functionName: 'isOwner',
        functionParams: [':userAddress'],
        functionAbi: {
          constant: true,
          inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
          name: 'isOwner',
          outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
          payable: false,
          stateMutability: 'view',
          type: 'function',
        },
        chain: 'polygon',
        returnValueTest: {
          key: '',
          comparator: '=',
          value: 'true',
        },
      },
    ];
    console.log(encryptedSymmetricKey);
    const symmetricKey = await client.getEncryptionKey({
      evmContractConditions,
      toDecrypt: encryptedSymmetricKey,
      chain,
      authSig,
    });
    console.log({ symmetricKey });
    return symmetricKey;
  }

  static async saveKey(
    evmContractConditions: object[],
    symmetricKey: string
  ): Promise<string> {
    const authSig = this.authSig;
    console.log(this.litNodeClient);
    const encryptedSymmetricKey = await Lit.litNodeClient.saveEncryptionKey({
      evmContractConditions,
      symmetricKey,
      authSig,
      chain,
    });
    console.log({ encryptedSymmetricKey });
    return encryptedSymmetricKey;
  }

  // static async basicAccessControlConditions(
  //   entityAddress: string
  // ): Promise<object[]> {
  // return [
  //   {
  //     contractAddress: entityAddress,
  //     standardContractType,
  //     chain,
  //     method: 'balanceOf',
  //     parameters: [':userAddress', '0'],
  //     returnValueTest: {
  //       comparator: '>',
  //       value: '0',
  //     },
  //   },
  // ];
  // }

  // static async applicationAccessControlConditions(
  //   applicationAddress: string,
  //   entityAddress: string
  // ): Promise<object[]> {
  //   return [
  //     {
  //       contractAddress: applicationAddress,
  //       standardContractType,
  //       chain,
  //       method: 'balanceOf',
  //       parameters: [':userAddress', '0'],
  //       returnValueTest: {
  //         comparator: '>',
  //         value: '0',
  //       },
  //     },
  //     { operator: 'and' },
  //     {
  //       contractAddress: entityAddress,
  //       standardContractType,
  //       chain,
  //       method: 'balanceOf',
  //       parameters: [applicationAddress, '0'],
  //       returnValueTest: {
  //         comparator: '>',
  //         value: '0',
  //       },
  //     },
  //   ];
  // }
}
