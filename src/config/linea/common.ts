import { AppConfig } from 'config/types';
import IconXfaiLogo from 'assets/logos/xfaiLogo.svg';

const addresses = {
  ETH: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  ZERO: '0x0000000000000000000000000000000000000000',
  WETH: '0xe5D7C2a44FfDDf6b295A15c148167daaAf5Cf34f',
  USDC: '0x176211869cA2b568f2A7D4EE941E073a821EE1ff',
  DAI: '0x4AF15ec2A0BD43Db75dd04E62FAA3B8EF36b00d5',
};

export const commonConfig: AppConfig = {
  mode: 'development',
  appUrl: 'https://strategies.xfai.com',
  carbonApi: 'https://strategies-api.xfai.com/v1/',
  selectableConnectionTypes: ['injected', 'coinbaseWallet'],
  walletConnectProjectId: '8ddcd05d875f85ad14494211df6350fc',
  isSimulatorEnabled: true,
  policiesLastUpdated: '27 May, 2024',
  network: {
    name: 'Linea Network',
    logoUrl: IconXfaiLogo,
    chainId: 59144,
    blockExplorer: { name: 'Lineascan', url: 'https://lineascan.build' },
    rpc: {
      url: import.meta.env.VITE_CHAIN_RPC_URL || 'https://rpc.linea.build',
      headers: {
        'x-apikey': import.meta.env.VITE_CHAIN_RPC_KEY || '',
      },
    },
    gasToken: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
      address: addresses.ETH,
      logoURI:
        'https://tokens.xfai.com/ethereum/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.webp',
    },
  },
  defaultTokenPair: [addresses.ETH, addresses.WETH],
  popularPairs: [
    [addresses.ETH, addresses.WETH],
    [addresses.ETH, addresses.USDC],
    [addresses.ETH, addresses.DAI],
  ],
  popularTokens: {
    base: [addresses.ETH, addresses.WETH, addresses.DAI, addresses.USDC],
    quote: [addresses.ETH, addresses.WETH, addresses.DAI, addresses.USDC],
  },
  addresses: {
    tokens: addresses,
    carbon: {
      carbonController: '0xdEbc64044CD911b0cc90DCC94bf97f440eb5e503',
      voucher: '0x3dae488DcB2835c43E71557E7745b838Dc7e46DD',
    },
    utils: {
      multicall: '0xcA11bde05977b3631167028862bE2a173976CA11',
    },
  },
  tokenListOverride: [
    {
      name: 'WETH',
      symbol: 'WETH',
      decimals: 18,
      address: addresses.WETH,
      logoURI:
        'https://tokens.xfai.com/ethereum/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.webp',
    },
  ],
  tokenLists: [
    {
      uri: 'https://raw.githubusercontent.com/Consensys/linea-token-list/main/json/linea-mainnet-token-shortlist.json',
    },
  ],
};
