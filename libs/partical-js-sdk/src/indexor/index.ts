import Moralis from 'moralis';

export class Indexor {
  static initialize() {
    const serverUrl = 'https://e6ss72rsmosx.usemoralis.com:2053/server';
    const appId = '6F5BP7sxHeCFc3yczy70u0xlF72oS9YQbOygTnoT';

    void Moralis.start({ serverUrl, appId });
  }

  static async addIndex(index: string, indexedData: object) {
    console.log('adding index ...');
    const IndexorObj = Moralis.Object.extend(index);
    const indexorObj = new IndexorObj();

    for (const [key, val] of Object.entries(indexedData)) {
      indexorObj.set(key, val);
    }

    return await indexorObj.save();
  }

  static query(index: string, query: object) {
    const IndexorObj = Moralis.Object.extend(index);
    const queryObj = new Moralis.Query(IndexorObj);

    for (const [key, val] of Object.entries(query)) {
      queryObj.equalTo(key, val);
    }
    return queryObj;
  }

  static async queryOneIndex(index: string, query: object) {
    const q = this.query(index, query);
    return await q.first();
  }

  static async queryIndex(index: string, query: object) {
    const q = this.query(index, query);
    return await q.find();
  }

  static async updateOneIndex(index: string, query: object, update: object) {
    const q = this.query(index, query);
    const indexorObj = await q.first();
    if (!indexorObj) {
      return false;
    }
    for (const [key, val] of Object.entries(update)) {
      indexorObj.set(key, val);
    }
    return await indexorObj.save();
  }

  static async deleteIndex(index: string, query: object) {
    const q = this.query(index, query);
    const indexorObj = await q.first();
    if (!indexorObj) {
      return false;
    }
    return await indexorObj.destroy();
  }
}
