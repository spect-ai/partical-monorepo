import LitJsSdk from 'lit-js-sdk';

const client = new LitJsSdk.LitNodeClient();
const standardContractType = 'ERC1155';
const chain = 'rinkeby';

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
    this.authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
    const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(
      message
    );
    return { encryptedString, symmetricKey };
  }

  static async saveKey(
    accessControlConditions: object[],
    symmetricKey: string
  ): Promise<string> {
    const authSig = this.authSig;
    console.log(this.litNodeClient);
    const encryptedSymmetricKey = await Lit.litNodeClient.saveEncryptionKey({
      accessControlConditions,
      symmetricKey,
      authSig,
      chain,
    });

    return encryptedSymmetricKey;
  }
}
