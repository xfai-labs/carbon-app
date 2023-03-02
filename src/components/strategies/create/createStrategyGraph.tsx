import { m } from 'libs/motion';
import { list } from './variants';
import { Button } from 'components/common/button';
import { TradingviewChart } from 'components/tradingviewChart';
import { ReactComponent as IconX } from 'assets/icons/X.svg';
import { Token } from 'libs/tokens';

type CreateStrategyGraphProps = {
  token0: Token | undefined;
  token1: Token | undefined;
  showGraph: boolean;
  showGraphToggle: () => void;
};

export const CreateStrategyGraph = ({
  token0,
  token1,
  showGraph,
  showGraphToggle,
}: CreateStrategyGraphProps) => {
  if (!showGraph) {
    return null;
  }
  return (
    <m.div
      variants={list}
      className="flex h-[550px] flex-col rounded-10 bg-silver p-20 pb-40"
    >
      <div className="flex items-center justify-between">
        <h2 className="mb-20 font-weight-500">Price Chart</h2>
        {showGraph && (
          <Button
            className={`mb-20 self-end bg-emphasis`}
            variant="secondary"
            size={'md'}
            onClick={showGraphToggle}
          >
            <div className="flex items-center justify-center">
              <IconX className={'w-10 md:mr-12'} />
              <span className="hidden md:block">Close Chart</span>
            </div>
          </Button>
        )}
      </div>
      <TradingviewChart token0={token0} token1={token1} />
    </m.div>
  );
};
