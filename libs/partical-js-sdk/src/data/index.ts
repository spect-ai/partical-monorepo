import Lit from '../lit';
import Ceramic from '../ceramic';

const chain = 'rinkeby';
const standardContractType = 'ERC1155';
export class Data {
  static async create(data: any, contractAddress: string) {
    try {
      /** TODO: Move this to Partical client */
      Lit.connect();
      Ceramic.initialize();

      const { encryptedString, symmetricKey }: any =
        await Lit.checkAndSignAuthMessage('encrypt');

      /** Authenticate using symmetric key and create key did */
      await Ceramic.authenticate(symmetricKey);
      const streamId = await Ceramic.createStream({
        data,
      });

      const encryptedKey = await Lit.saveKey(
        [
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
        ],
        encryptedString
      );
      return { streamId, encryptedKey };
    } catch (e) {
      console.log({ e });
      return false;
    }
  }
}
