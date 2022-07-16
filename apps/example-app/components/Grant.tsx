import { Avatar, Box, Heading, Text } from 'degen';
import Link from 'next/link';
import React from 'react';
import { GrantData } from '../pages/createGrant';

type Props = {
  grant: GrantData;
};

export default function Grant({ grant }: Props) {
  return (
    <Link href="/grant/kjzl6cwe1jw14b74w635mach0zrqhxtxphholk0au854byxa2zeagtw94ym4cyl">
      <Box
        height="64"
        borderWidth="0.375"
        borderRadius="2xLarge"
        cursor="pointer"
      >
        <Heading>{grant.title}</Heading>
        <Text ellipsis>{grant.description}</Text>
        <Avatar src={grant.image} label=""></Avatar>
      </Box>
    </Link>
  );
}
