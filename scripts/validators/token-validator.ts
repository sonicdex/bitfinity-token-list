import Ajv from 'ajv';
import ajvFormats from 'ajv-formats';

const ajv = new Ajv();
ajvFormats(ajv);

const tokenInfoSchema = {
  type: 'object',
  description: 'Metadata for a single token in a token list',
  additionalProperties: false,
  properties: {
    address: {
      type: 'string',
      description: 'The checksummed address of the token on the bitfinity',
      pattern: '^0x[a-fA-F0-9]{40}$',
      examples: ['0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'],
    },
    decimals: {
      type: 'integer',
      description: 'The number of decimals for the token balance',
      minimum: 0,
      maximum: 255,
      examples: [18],
    },
    name: {
      type: 'string',
      description: 'The name of the token',
      minLength: 0,
      maxLengtth: 60,
      anyOf: [
        {
          const: '',
        },
        {
          pattern: '^[ \\S+]+$',
        },
      ],
      examples: ['Sonic'],
    },
    symbol: {
      type: 'string',
      description: 'The symbol for the token',
      minLength: 0,
      maxLength: 20,
      anyOf: [
        {
          const: '',
        },
        {
          pattern: '^\\S+$',
        },
      ],
      examples: ['SONIC'],
    },
    logoURI: {
      type: 'string',
      description:
        'A URI to the token logo asset; if not set, interface will attempt to find a logo based on the token address; suggest SVG or PNG of size 64x64',
      format: 'uri',
      examples: ['ipfs://QmXfzKRvjZz3u5JRgC4v5mGVbm9ahrUiB4DgzHBsnWbTMM'],
    },
  },
  required: ['address', 'decimals', 'name', 'symbol'],
};

// Create the validator
const validateTokenInfo = ajv.compile(tokenInfoSchema);

export { validateTokenInfo };
