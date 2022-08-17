import { Modal, Select } from '@partical/common';
import {
  Box,
  Button,
  Heading,
  IconCollection,
  IconPlusSmall,
  Input,
  Stack,
  Text,
} from 'degen';
import { AnimatePresence } from 'framer-motion';
import React, { useState } from 'react';
import styled from 'styled-components';
import { defaultColumns, typeOptions } from '../utils/constants';

const NameInput = styled.input<{ mode: string }>`
  width: auto;
  background: transparent;
  border: 0;
  border-style: none;
  border-color: transparent;
  outline: none;
  outline-offset: 0;
  box-shadow: none;
  font-size: 1.1rem;
  caret-color: ${(props) =>
    props.mode === 'dark' ? 'rgb(255, 255, 255, 0.7)' : 'rgb(20, 20, 20, 0.7)'};
  color: ${(props) =>
    props.mode === 'dark' ? 'rgb(255, 255, 255, 0.7)' : 'rgb(20, 20, 20, 0.7)'};
  font-weight: semiBold;
  margin-left: 0.1rem;
`;

type props = {
  serverURL: string;
  fetchSchema: () => void;
};

export default function CreateSchema({ serverURL, fetchSchema }: props) {
  const [isOpen, setIsOpen] = useState(false);
  const [columns, setColumns] = useState(defaultColumns);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <>
      <Button
        prefix={<IconCollection />}
        center
        onClick={() => setIsOpen(true)}
        width="64"
      >
        Create Schema
      </Button>
      <AnimatePresence>
        {isOpen && (
          <Modal title="Create Schema" handleClose={() => setIsOpen(false)}>
            <Box padding="8">
              <Stack>
                <Input
                  label=""
                  width="1/2"
                  placeholder="Schema Name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
                {columns.map((column) => (
                  <Stack direction="horizontal" key={column.name}>
                    <Box width="48">
                      {/* <Text variant="large" weight="semiBold">
                        {column.name}
                      </Text> */}
                      <NameInput
                        disabled={column.disabled}
                        placeholder="Add Title"
                        defaultValue={column.name}
                        onBlur={(e) => {
                          setColumns((prev) => {
                            const newColumns = [...prev];
                            const index = newColumns.findIndex(
                              (c) => c.name === column.name
                            );
                            newColumns[index].name = e.target.value;
                            return newColumns;
                          });
                        }}
                        // onBlur={() => updateColumn()}
                        mode={'dark'}
                        //   disabled={space.roles[user?.id as string] !== 3}
                      />
                    </Box>
                    <Select
                      options={typeOptions}
                      value={column.type}
                      onChange={(value) => {
                        setColumns((prev) => {
                          const newColumns = [...prev];
                          const index = newColumns.findIndex(
                            (c) => c.name === column.name
                          );
                          newColumns[index].type = value;
                          return newColumns;
                        });
                      }}
                    />
                  </Stack>
                ))}
                <Stack direction="horizontal">
                  <Button
                    size="small"
                    shape="circle"
                    width="1/4"
                    variant="secondary"
                    onClick={() => {
                      console.log('.....');
                      setColumns([
                        ...columns,
                        {
                          name: 'new',
                          type: { label: 'String', value: 'string' },
                          disabled: false,
                        },
                      ]);
                    }}
                  >
                    Add Column
                  </Button>
                  <Button
                    size="small"
                    shape="circle"
                    width="1/4"
                    variant="secondary"
                    loading={loading}
                    onClick={async () => {
                      setLoading(true);
                      const fields = columns.map((column) => {
                        if (!column.disabled) {
                          return {
                            name: column.name,
                            type: column.type.value,
                            unique: false,
                          };
                        }
                      });
                      console.log(
                        JSON.stringify({
                          name,
                          fields: fields.filter((f) => f),
                        })
                      );
                      console.log({ serverURL });
                      const res = await fetch(`${serverURL}/schema`, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          name,
                          fields: fields.filter((f) => f),
                        }),
                      });
                      if (res.ok) {
                        console.log('done');
                        const data = await res.json();
                        console.log({ data });
                        fetchSchema();
                        setIsOpen(false);
                      }
                      setLoading(false);
                    }}
                  >
                    Save
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}
