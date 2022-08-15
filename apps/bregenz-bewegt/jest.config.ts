import * as path from 'path';

/* eslint-disable */
export default {
  displayName: 'bregenz-bewegt',
  preset: '../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nrwl/react/plugins/jest',
    '^.+\\.[tj]sx?$': [
      'babel-jest',
      { configFile: path.resolve(__dirname, '.babelrc') },
    ],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@ionic/react|@ionic/react-router|@ionic/core|@stencil/core|ionicons)/)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/apps/bregenz-bewegt',
};
