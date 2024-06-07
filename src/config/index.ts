import lineaDev from './linea/development';
import lineaProd from './linea/production';
export { pairsToExchangeMapping } from './utils';

const configs = {
  linea: {
    development: lineaDev,
    production: lineaProd,
  },
};
type Network = keyof typeof configs;
type Mode = 'development' | 'production';

const network = (import.meta.env.VITE_NETWORK || 'linea') as Network;
const mode = import.meta.env.MODE as Mode;

if (!configs[network]) {
  const networks = Object.keys(configs).join(' or ');
  throw new Error(`VITE_NETWORK should be ${networks}, got "${network}"`);
}
if (!configs[network][mode]) {
  const modes = Object.keys(configs[network]).join(' or ');
  throw new Error(`NODE_ENV should be ${modes}, got "${mode}"`);
}

export default configs[network][mode];
