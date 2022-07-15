import { Entity, Stream } from '@partical/partical-js-sdk';
import { Box, Button, Heading, Input, Stack } from 'degen';
import React, { useEffect, useState } from 'react';
import { useMoralis } from 'react-moralis';

export default function ViewData() {
  const { user } = useMoralis();
  const [myEntity, setMyEntity] = useState<any>();
  const [myAppData, setMyAppData] = useState<any>();
  const [address, setAddress] = useState('');
  const entity = new Entity.Entity();

  useEffect(() => {
    const getMyData = async () => {
      const myEntity = await entity.getMyEntity(user.get('ethAddress'));
      console.log(myEntity);
      const myData = await entity.getMyAppData(myEntity.get('entityAddress'));
      console.log({ myData });
      setMyEntity(myEntity);
      setMyAppData(myData);
    };
    if (user) {
      getMyData();
    }
  }, [user]);

  return (
    <Box padding="8">
      <Heading>View Data</Heading>
      {myAppData?.appData.map((data: any) => (
        <Stack key={data.key}>
          <Heading>{data.grantAddress}</Heading>
          <Heading>{data.grantDescription}</Heading>
          <Heading>{data.grantName}</Heading>
          <Input
            placeholder="Grant Address"
            label=""
            value={address}
            onChange={(e: any) => setAddress(e.target.value)}
          />
          <Button
            onClick={async () => {
              const streamSDK = new Stream.StreamData({
                apiKey: '',
              });
              console.log({ myEntity, data });
              const res = await streamSDK.updateStreamData(
                myEntity.get('encryptedSymmetricKey'),
                myEntity.get('entityAddress'),
                data.streamId,
                {
                  grantAddress: address,
                }
              );
              console.log({ res });
            }}
          >
            Update Stream
          </Button>
        </Stack>
      ))}
      <Stack>
        <Input
          placeholder="address"
          label=""
          value={address}
          onChange={(e: any) => setAddress(e.target.value)}
        />
        <Button
          onClick={() => {
            void entity.giveAccess(myEntity.get('entityAddress'), address);
          }}
        >
          Give Acesss
        </Button>
      </Stack>
    </Box>
  );
}
