import { Avatar, Box, Heading, Stack, Text } from 'degen';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';
import { GrantData } from '../pages/createGrant';

type Props = {
  grant: GrantData;
};

export const GrantCover = styled.div<{ src: string }>`
  background-image: url(${({ src }) => src});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 200px;
  width: 100%;
  border-radius: 1rem;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
`;

export default function Grant({ grant }: Props) {
  return (
    <Link href={`/grant/${grant.streamId}`}>
      <Box
        height="96"
        borderWidth="0.375"
        borderRadius="2xLarge"
        cursor="pointer"
      >
        <Stack align="center" space="1">
          <GrantCover src={grant.image} />
          <Box padding="4">
            <Text align="center" weight="semiBold" size="large">
              {grant.title}
            </Text>
            <Box>
              <Text>{grant.description.substring(0, 100)}</Text>
            </Box>
          </Box>
        </Stack>
      </Box>
    </Link>
  );
}
