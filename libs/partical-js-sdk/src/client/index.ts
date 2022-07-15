import { CeramicClient } from '@ceramicnetwork/http-client';
import { Contract } from 'ethers';
import LitJsSdk from 'lit-js-sdk';
import Moralis from 'moralis';
import Ceramic from '../ceramic';
import Lit from '../lit';

export class ParticalClient {
  ceramicClient!: CeramicClient;
  litClient: any;

  constructor(_ceramicClientUri?: string) {
    const serverUrl = 'https://e6ss72rsmosx.usemoralis.com:2053/server';
    const appId = '6F5BP7sxHeCFc3yczy70u0xlF72oS9YQbOygTnoT';

    void Moralis.start({ serverUrl, appId });

    Ceramic.initialize(_ceramicClientUri);
    Lit.connect();
  }
}
