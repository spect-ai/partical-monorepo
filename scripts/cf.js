Moralis.Cloud.define('getStreams', async (request) => {
  const logger = new Moralis.Cloud.getLogger();
  const streamQuery = new Moralis.Query('StreamIndexer');
  logger.info(`getStreams ${request.params.streamId}`);

  const pipeline = [
    { match: { streamId: request.params.streamId } },
    {
      lookup: {
        from: 'Namespace',
        localField: 'appId',
        foreignField: 'appId',
        as: 'namespace',
      },
    },
  ];
  logger.info('getStreams', request.params.streamId);

  var stream = await streamQuery.aggregate(pipeline, { useMasterKey: true });
  if (stream.length === 0) throw 'Stream not found';
  return stream;
});
