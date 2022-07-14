import { getContractABI, getContractAddress } from '@partical/contracts';
import { Box, Button, Stack } from 'degen';
import React from 'react';
import useContract from '../../services/contract/useContract';

export default function Entity() {
  const { createEntity, updateEntityUri } = useContract({
    factoryAddress: getContractAddress('4'),
    factoryABI: getContractABI('factory'),
    entityABI: getContractABI('entity'),
  });

  return (
    <Box padding="8">
      <Stack direction="horizontal">
        <Button
          variant="secondary"
          onClick={async () => {
            const data = await createEntity('');
            console.log(data);
          }}
        >
          Create Entity
        </Button>
        <Button
          variant="secondary"
          onClick={async () => {
            const data = await updateEntityUri(
              '0x74B0BEafb7409075793fD876a485E611F778CFce',
              'https://www.google.com'
            );
            console.log(data);
          }}
        >
          Update Entity
        </Button>
      </Stack>
    </Box>
  );
}
