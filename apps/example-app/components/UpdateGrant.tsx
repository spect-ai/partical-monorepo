import { Modal } from '@partical/common';
import { useAppData, useStream } from '@partical/react-partical-old';
import { Box, Button, Input, Stack, Textarea } from 'degen';
import { AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useMoralis } from 'react-moralis';
import { GrantData } from '../pages/createGrant';

interface props {
  grant: GrantData;
  streamId: string;
  getData: () => void;
}

export default function UpdateGrant({ grant, streamId, getData }: props) {
  const router = useRouter();
  const { stream } = router.query;
  const { canEditStream } = useStream({
    appId: '0be7a9c7-c6d2-44f3-8fed-1766ed3600fb',
    streamId: stream as string,
  });
  const { updateAppData, loading } = useAppData<GrantData>({
    appId: '0be7a9c7-c6d2-44f3-8fed-1766ed3600fb',
  });
  const { user } = useMoralis();
  const [canEdit, setCanEdit] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [name, setName] = useState(grant.title);
  const [description, setDescription] = useState(grant.description);

  useEffect(() => {
    const fetchCanEdit = async () => {
      const canEdit = await canEditStream(user?.get('ethAddress'));
      setCanEdit(canEdit);
    };
    if (user) {
      fetchCanEdit();
    }
  }, [canEditStream, user]);

  useEffect(() => {
    setName(grant.title);
    setDescription(grant.description);
  }, [isOpen]);

  return (
    <>
      {canEdit && (
        <Button
          size="small"
          variant="secondary"
          onClick={() => {
            setIsOpen(true);
          }}
        >
          Edit Grant
        </Button>
      )}
      <AnimatePresence>
        {isOpen && (
          <Modal title="Update Grant" handleClose={() => setIsOpen(false)}>
            <Box padding="8">
              <Stack>
                <Input
                  label="Title"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Textarea
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <Button
                  loading={loading}
                  onClick={async () => {
                    const res = await updateAppData(
                      streamId,
                      {
                        title: name,
                        description: description,
                      },
                      grant.entityAddress
                    );
                    if (res) {
                      getData();
                      setIsOpen(false);
                    }
                  }}
                >
                  Update
                </Button>
              </Stack>
            </Box>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}
