Moralis.Cloud.define('getEntityStreams', async (request) => {
  const logger = new Moralis.Cloud.getLogger();
  const streamQuery = new Moralis.Query('StreamIndexer');

  const pipeline = [
    { match: { entityAddress: request.params.entityAddress } },
    {
      lookup: {
        from: 'Namespace',
        localField: 'appId',
        foreignField: 'appId',
        as: 'namespace',
      },
    },
  ];
  logger.info(`getStreams  ${request.params.entityAddress}`);

  var streams = await streamQuery.aggregate(pipeline, { useMasterKey: true });
  if (streams.length === 0) throw 'Entity not found';
  return streams;
});
