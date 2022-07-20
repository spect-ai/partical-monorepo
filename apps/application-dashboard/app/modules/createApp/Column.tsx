import { Input, Stack, Text } from 'degen';
import React from 'react';

type Props = {
  name: string;
  type: string;
};

export default function Column({ name, type }: Props) {
  return (
    <Stack direction="horizontal" space="4">
      <Stack space="0.5">
        <Input label="" placeholder="Name" />
      </Stack>
      <Stack space="0.5">
        <Input label="" placeholder="Type" />
      </Stack>
    </Stack>
  );
}
