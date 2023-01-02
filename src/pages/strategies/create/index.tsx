import { WalletConnect } from 'components/walletConnect';
import { CreateStrategy } from 'elements/strategies/create';
import { useWeb3 } from 'web3';

export const CreateStrategyPage = () => {
  const { user } = useWeb3();

  return user ? (
    <div className={'mx-auto max-w-[350px]'}>
      <CreateStrategy />
    </div>
  ) : (
    <WalletConnect />
  );
};
