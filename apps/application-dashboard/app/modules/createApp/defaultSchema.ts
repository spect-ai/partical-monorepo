export const defaultSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'My App Schema',
  type: 'object',
  properties: {
    entityAddress: {
      description: 'The Entity Address',
      type: 'string',
    },
  },
  required: ['entityAddress'],
};
