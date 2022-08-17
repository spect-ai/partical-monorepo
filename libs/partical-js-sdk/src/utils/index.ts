// eslint-disable-next-line @typescript-eslint/no-var-requires

import { randomBytes } from 'crypto';
import { NFTStorage } from 'nft.storage';

export function generateKey(size = 32) {
  const buffer = randomBytes(size);
  return buffer.toString('base64');
}

export function generateSecretHash(key: string) {
  const salt = randomBytes(8).toString('hex');

  throw new Error('Not implemented');

  // return `${buffer.toString('hex')}.${salt}`;
}

export function compareKeys(storedKey: string, suppliedKey: string) {
  // const [hashedPassword, salt] = storedKey.split('.');
  // const buffer = scryptSync(suppliedKey, salt, 64) as Buffer;
  // return timingSafeEqual(Buffer.from(hashedPassword, 'hex'), buffer);
}

// async function getExampleImage() {
//   const imageOriginUrl =
//     'https://user-images.githubusercontent.com/87873179/144324736-3f09a98e-f5aa-4199-a874-13583bf31951.jpg';
//   const r = await fetch(imageOriginUrl, {
//     mode: 'no-cors',
//   });
//   //   if (!r.ok) {
//   //     throw new Error(`error fetching image: [${r.status}]: ${r.status}`);
//   //   }
//   return r.blob();
// }

// export async function storeMetadata(
//   name: string,
//   encryptedSymmetricKey: string,
//   streamId: string
// ) {
//   const image = await getExampleImage();
//   const nft = {
//     image,
//     name,
//     description: '',
//     encryptedSymmetricKey: encryptedSymmetricKey,
//     dataStore: streamId,
//   };

//   const client = new NFTStorage({
//     token:
//       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDUxMTMwRjUxMDg2YjQ0ODNjNjk3NUFCNjc3NTRBODYzMTcxQzEwYzEiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1NzcxNDI4ODEzNSwibmFtZSI6IlBhcnRpY2FsIn0.M4hd-uXX7-QPx-CNtQjYtESZYJ8V5Ne1wtLqI7jlyM8',
//   });
//   const metadata = await client.store(nft);

//   console.log('NFT data stored!');
//   console.log('Metadata URI: ', metadata.url);
//   return metadata.url;
// }
