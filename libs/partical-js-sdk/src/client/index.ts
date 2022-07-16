import { CeramicClient } from '@ceramicnetwork/http-client';
import { Ceramic } from '../ceramic';
import { Indexor } from '../indexor';
import Lit from '../lit';

export class ParticalClient {
  ceramicClient!: CeramicClient;
  litClient: any;

  constructor(_ceramicClientUri?: string) {
    Indexor.initialize();
    Ceramic.initialize(_ceramicClientUri);
    Lit.connect();
  }
}
