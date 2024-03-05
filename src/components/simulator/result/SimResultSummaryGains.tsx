import { Tooltip } from 'components/common/tooltip/Tooltip';
import { ReactComponent as IconTooltip } from 'assets/icons/tooltip.svg';
import { prettifySignedNumber } from 'utils/helpers';
import { FC, useCallback } from 'react';
import { Token } from 'libs/tokens';
import { AnimatedNumber } from 'components/common/AnimatedNumber';

interface Props {
  quoteToken: Token;
  portfolioGains: number;
}

export const SimResultSummaryGains: FC<Props> = ({
  portfolioGains,
  quoteToken,
}) => {
  const formatGain = useCallback(
    (gains: number) => {
      const value = prettifySignedNumber(gains, { round: true });
      return `${quoteToken.symbol} ${value}`;
    },
    [quoteToken.symbol]
  );

  return (
    <article className="col-span-2 flex flex-col rounded-8">
      <Tooltip element={<TooltipContent />}>
        <h4 className="text-secondary flex items-center gap-4 font-mono !text-12">
          Estimated Gains
          <IconTooltip className="h-10 w-10" />
        </h4>
      </Tooltip>
      <AnimatedNumber
        className="text-24 font-weight-500"
        from={0.0}
        to={portfolioGains}
        formatFn={formatGain}
        duration={2}
        data-testid="summary-gains"
      />
    </article>
  );
};

const TooltipContent: FC<{}> = () => (
  <>
    <p className="align-middle">
      Estimated gains your trading strategy might have generated over the
      specified period. Amounts are denominated in the quote token.
    </p>
  </>
);