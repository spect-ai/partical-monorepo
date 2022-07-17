import { CeramicClient } from '@ceramicnetwork/http-client';
import { Ceramic } from '../ceramic';
import { Indexor } from '../indexor';
import Lit from '../lit';
import OnChainEntityFactory from '../contract/OnChainEntityFactory';

export class ParticalClient {
  ceramicClient!: CeramicClient;
  litClient: any;

  constructor(_ceramicClientUri?: string) {
    Indexor.initialize();
    Ceramic.initialize(_ceramicClientUri || 'http://localhost:7007');
    Lit.connect();
    OnChainEntityFactory.initContract();
  }
}
