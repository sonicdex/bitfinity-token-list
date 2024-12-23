import Ajv from 'ajv';
import { promises as fs } from 'fs';
import addFormats from 'ajv-formats';
import { TokenInfo, TokenList } from '@src/types';

const schemaPath = './src/tokenlist.schema.json';
