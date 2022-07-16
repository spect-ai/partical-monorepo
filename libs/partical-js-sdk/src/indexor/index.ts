import Moralis from 'moralis';

export class Indexor {
  static initialize() {
    const serverUrl = 'https://e6ss72rsmosx.usemoralis.com:2053/server';
    const appId = '6F5BP7sxHeCFc3yczy70u0xlF72oS9YQbOygTnoT';

    void Moralis.start({ serverUrl, appId });
  }

  static async addIndex(index: string, indexedData: object) {
    const IndexorObj = Moralis.Object.extend(index);
    const indexorObj = new IndexorObj();

    for (const [key, val] of Object.entries(indexedData)) {
      indexorObj.set(key, val);
    }

    return await indexorObj.save();
  }

  static async queryIndex(index: string, query: object) {
    console.log('hiiiii');
    const IndexorObj = Moralis.Object.extend(index);
    const queryObj = new Moralis.Query(IndexorObj);

    for (const [key, val] of Object.entries(query)) {
      queryObj.equalTo(key, val);
    }
    console.log({ queryObj });
    return await queryObj.find();
  }

  static async deleteIndex(index: string, query: object) {
    console.log('delete');
  }
}
