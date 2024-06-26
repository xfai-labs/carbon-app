import { FC, useEffect, useState } from 'react';
import { OrderCreate } from 'components/strategies/create/useOrder';
import { Strategy, useGetTokenBalance } from 'libs/queries';
import {
  getMaxBuyMin,
  getMinSellMax,
  getRoundedSpread,
  hasArbOpportunity,
  isMaxBelowMarket,
  isMinAboveMarket,
  isValidSpread,
} from 'components/strategies/overlapping/utils';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { OverlappingStrategyGraph } from 'components/strategies/overlapping/OverlappingStrategyGraph';
import { OverlappingSpread } from 'components/strategies/overlapping/OverlappingSpread';
import { OverlappingRange } from 'components/strategies/overlapping/OverlappingRange';
import { isValidRange } from 'components/strategies/utils';
import {
  calculateOverlappingBuyBudget,
  calculateOverlappingPrices,
  calculateOverlappingSellBudget,
} from '@bancor/carbon-sdk/strategy-management';
import { SafeDecimal } from 'libs/safedecimal';
import {
  OverlappingBudgetDescription,
  OverlappingBudgetDistribution,
} from 'components/strategies/overlapping/OverlappingBudgetDistribution';
import { OverlappingAnchor } from 'components/strategies/overlapping/OverlappingAnchor';
import { BudgetAction } from 'components/strategies/common/BudgetInput';
import { getDeposit, getWithdraw } from '../utils';
import { OverlappingAction } from 'components/strategies/overlapping/OverlappingAction';
import {
  hasNoBudget,
  useOverlappingMarketPrice,
} from 'components/strategies/overlapping/useOverlappingMarketPrice';
import {
  OverlappingInitMarketPriceField,
  OverlappingMarketPrice,
} from 'components/strategies/overlapping/OverlappingMarketPrice';
import { UserMarketPrice } from 'components/strategies/UserMarketPrice';
import { WarningMessageWithIcon } from 'components/common/WarningMessageWithIcon';
import { formatNumber } from 'utils/helpers';

interface Props {
  strategy: Strategy;
  order0: OrderCreate;
  order1: OrderCreate;
}

interface ResetBudgets {
  deltaValue?: string;
  anchorValue?: 'buy' | 'sell';
  min?: string;
  max?: string;
}

// When working with edit overlapping we can't trust marginal price when budget was 0, so we need to recalculate
export function isEditAboveMarket(
  min: string,
  max: string,
  marketPrice: number | undefined,
  spread: number
) {
  if (!marketPrice) return false;
  const prices = calculateOverlappingPrices(
    formatNumber(min || '0'),
    formatNumber(max || '0'),
    marketPrice.toString(),
    spread.toString()
  );
  return isMinAboveMarket({
    min: prices.buyPriceLow,
    marginalPrice: prices.buyPriceMarginal,
  });
}
export function isEditBelowMarket(
  min: string,
  max: string,
  marketPrice: number | undefined,
  spread: number
) {
  if (!marketPrice) return false;
  const prices = calculateOverlappingPrices(
    formatNumber(min || '0'),
    formatNumber(max || '0'),
    marketPrice.toString(),
    spread.toString()
  );
  return isMaxBelowMarket({
    max: prices.sellPriceHigh,
    marginalPrice: prices.sellPriceMarginal,
  });
}

export const EditPriceOverlappingStrategy: FC<Props> = (props) => {
  const { strategy, order0, order1 } = props;
  const { base, quote } = strategy;
  const baseBalance = useGetTokenBalance(base).data;
  const quoteBalance = useGetTokenBalance(quote).data;
  const [spread, setSpread] = useState(getRoundedSpread(strategy));
  const [touched, setTouched] = useState(false);
  const [delta, setDelta] = useState('');
  const [anchor, setAnchor] = useState<'buy' | 'sell' | undefined>();
  const [anchorError, setAnchorError] = useState('');
  const [budgetError, setBudgetError] = useState('');
  const [action, setAction] = useState<'deposit' | 'withdraw'>('deposit');

  const externalPrice = useMarketPrice({ base, quote });
  const initialMarketPrice = useOverlappingMarketPrice(strategy);
  const [marketPrice, setMarketPrice] = useState(initialMarketPrice);
  const [userMarketPrice, setUserMarketPrice] = useState(externalPrice);

  const initialBuyBudget = strategy.order0.balance;
  const initialSellBudget = strategy.order1.balance;
  const depositBuyBudget = getDeposit(initialBuyBudget, order0.budget);
  const withdrawBuyBudget = getWithdraw(initialBuyBudget, order0.budget);
  const depositSellBudget = getDeposit(initialSellBudget, order1.budget);
  const withdrawSellBudget = getWithdraw(initialSellBudget, order1.budget);

  const belowMarket = isEditBelowMarket(
    order0.min,
    order1.max,
    userMarketPrice,
    spread
  );
  const aboveMarket = isEditAboveMarket(
    order0.min,
    order1.max,
    userMarketPrice,
    spread
  );

  const budgetWarning = (() => {
    if (action !== 'deposit') return;
    if (hasArbOpportunity(order0.marginalPrice, spread, userMarketPrice)) {
      const buyBudgetChanged = strategy.order0.balance !== order0.budget;
      const sellBudgetChanged = strategy.order1.balance !== order1.budget;
      if (!buyBudgetChanged && !sellBudgetChanged) return;
      return 'Please note that the deposit might create an arb opportunity.';
    }
  })();

  const calculateBuyBudget = (
    sellBudget: string,
    buyMin: string,
    sellMax: string
  ) => {
    if (!base || !quote || !marketPrice) return;
    if (!Number(sellBudget)) return order0.setBudget('0');
    if (aboveMarket) return order0.setBudget('0');
    try {
      const buyBudget = calculateOverlappingBuyBudget(
        base.decimals,
        quote.decimals,
        buyMin,
        sellMax,
        marketPrice.toString(),
        spread.toString(),
        sellBudget
      );
      order0.setBudget(buyBudget);
    } catch (error) {
      console.error(error);
    }
  };

  const calculateSellBudget = (
    buyBudget: string,
    buyMin: string,
    sellMax: string
  ) => {
    if (!base || !quote || !marketPrice) return;
    if (!Number(buyBudget)) return order1.setBudget('0');
    if (belowMarket) return order1.setBudget('0');
    try {
      const sellBudget = calculateOverlappingSellBudget(
        base.decimals,
        quote.decimals,
        buyMin,
        sellMax,
        marketPrice.toString(),
        spread.toString(),
        buyBudget
      );
      order1.setBudget(sellBudget);
    } catch (error) {
      console.error(error);
    }
  };

  const setOverlappingPrices = (
    min: string,
    max: string,
    spreadValue: string = spread.toString()
  ) => {
    if (!base || !quote || !marketPrice) return;
    if (!isValidRange(min, max) || !isValidSpread(spread)) return;
    const prices = calculateOverlappingPrices(
      formatNumber(min || '0'),
      formatNumber(max || '0'),
      marketPrice.toString(),
      spreadValue
    );

    order0.setMax(prices.buyPriceHigh);
    order0.setMarginalPrice(prices.buyPriceMarginal);
    order1.setMin(prices.sellPriceLow);
    order1.setMarginalPrice(prices.sellPriceMarginal);
    return prices;
  };

  const setOverlappingParams = (
    min: string,
    max: string,
    spreadValue: string = spread.toString()
  ) => {
    // Set min & max.
    order0.setMin(min);
    order1.setMax(max);

    const prices = setOverlappingPrices(min, max, spreadValue);
    if (!prices) return;

    // Set budgets
    const buyOrder = { min, marginalPrice: prices.buyPriceMarginal };
    const buyBudget = order0.budget;
    const sellOrder = { max, marginalPrice: prices.sellPriceMarginal };
    const sellBudget = order1.budget;

    if (!touched) {
      setTouched(true);
      setMarketPrice(userMarketPrice);
    }
    // If there is not anchor display error
    if (!anchor) return setAnchorError('Please select a token to proceed');

    if (isMinAboveMarket(buyOrder)) {
      if (anchor !== 'sell') {
        resetBudgets({ anchorValue: 'sell', min, max });
        setAnchor(undefined);
      } else {
        calculateBuyBudget(sellBudget, min, max);
      }
    } else if (isMaxBelowMarket(sellOrder)) {
      if (anchor !== 'buy') {
        resetBudgets({ anchorValue: 'buy', min, max });
        setAnchor(undefined);
      } else {
        calculateSellBudget(buyBudget, min, max);
      }
    } else {
      if (anchor === 'buy') calculateSellBudget(buyBudget, min, max);
      if (anchor === 'sell') calculateBuyBudget(sellBudget, min, max);
    }
  };

  const resetBudgets = ({
    deltaValue = '',
    anchorValue = anchor,
    min = order0.min,
    max = order1.max,
  }: ResetBudgets) => {
    setDelta(deltaValue);
    setBudgetError('');
    if (!touched) {
      order0.setBudget(initialBuyBudget);
      order1.setBudget(initialSellBudget);
      return;
    }
    if (anchorValue === 'buy') {
      order0.setBudget(initialBuyBudget);
      calculateSellBudget(initialBuyBudget, min, max);
    } else {
      order1.setBudget(initialSellBudget);
      calculateBuyBudget(initialSellBudget, min, max);
    }
  };

  const setMarketPriceValue = (value: number) => {
    setMarketPrice(value);
    setUserMarketPrice(value);
    setTouched(true);
  };

  const setSpreadValue = (value: number) => {
    setSpread(value);
    setOverlappingParams(order0.min, order1.max, value.toString());
  };

  const setActionValue = (value: BudgetAction) => {
    resetBudgets({});
    setAction(value);
  };

  const setAnchorValue = (value: 'buy' | 'sell') => {
    if (!anchor) {
      setAnchorError('');
      if (hasNoBudget(strategy)) setOverlappingPrices(order0.min, order1.max);
    }
    resetBudgets({ anchorValue: value });
    setAnchor(value);
  };

  const setMin = (min: string) => {
    if (!order1.max) return order0.setMin(min);
    setOverlappingParams(min, order1.max);
  };

  const setMax = (max: string) => {
    if (!order0.min) return order1.setMax(max);
    setOverlappingParams(order0.min, max);
  };

  const setBudget = (amount: string) => {
    if (!Number(amount)) return resetBudgets({ deltaValue: amount });
    setDelta(amount);

    if (anchor === 'buy') {
      const initial = new SafeDecimal(initialBuyBudget);
      const buyBudget =
        action === 'deposit' ? initial.add(amount) : initial.sub(amount);
      order0.setBudget(buyBudget.toString());
      calculateSellBudget(buyBudget.toString(), order0.min, order1.max);
    } else {
      const initial = new SafeDecimal(initialSellBudget);
      const sellBudget =
        action === 'deposit' ? initial.add(amount) : initial.sub(amount);
      order1.setBudget(sellBudget.toString());
      calculateBuyBudget(sellBudget.toString(), order0.min, order1.max);
    }
  };

  // Initialize / update market with external market price
  useEffect(() => {
    if (!userMarketPrice || externalPrice === userMarketPrice) {
      setUserMarketPrice(externalPrice);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalPrice]);

  useEffect(() => {
    if (touched || hasNoBudget(strategy)) setMarketPrice(userMarketPrice);
  }, [userMarketPrice, touched, strategy]);

  useEffect(() => {
    const error = (() => {
      const value = anchor === 'buy' ? order0.budget : order1.budget;
      const budget = new SafeDecimal(value);
      if (action === 'deposit' && anchor === 'buy' && quoteBalance) {
        const delta = budget.sub(initialBuyBudget);
        if (delta.gt(quoteBalance)) return 'Insufficient balance';
      }
      if (action === 'deposit' && anchor === 'sell' && baseBalance) {
        const delta = budget.sub(initialSellBudget);
        if (delta.gt(baseBalance)) return 'Insufficient balance';
      }
      if (action === 'withdraw' && anchor === 'buy' && quoteBalance) {
        if (budget.lt(0)) return 'Insufficient funds';
      }
      if (action === 'withdraw' && anchor === 'sell' && baseBalance) {
        if (budget.lt(0)) return 'Insufficient funds';
      }
      return '';
    })();
    setBudgetError(error);
  }, [
    baseBalance,
    quoteBalance,
    anchor,
    order0.budget,
    order1.budget,
    action,
    initialBuyBudget,
    initialSellBudget,
  ]);

  useEffect(() => {
    if (!touched || !spread || !marketPrice) return;
    setOverlappingParams(order0.min, order1.max);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [touched, anchor, marketPrice]);

  // Update on buyMin changes
  useEffect(() => {
    if (!order0.min) return;
    const timeout = setTimeout(async () => {
      const minSellMax = getMinSellMax(Number(order0.min), spread);
      if (Number(order1.max) < minSellMax) setMax(minSellMax.toString());
    }, 1500);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order0.min]);

  // Update on sellMax changes
  useEffect(() => {
    if (!order1.max) return;
    const timeout = setTimeout(async () => {
      const maxBuyMin = getMaxBuyMin(Number(order1.max), spread);
      if (Number(order0.min) > maxBuyMin) setMin(maxBuyMin.toString());
    }, 1500);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order1.max]);

  if (!base || !quote) return;

  if (!userMarketPrice) {
    return (
      <article className="rounded-10 bg-background-900 flex flex-col">
        <OverlappingInitMarketPriceField
          base={base}
          quote={quote}
          marketPrice={userMarketPrice}
          setMarketPrice={setMarketPriceValue}
        />
      </article>
    );
  }

  return (
    <UserMarketPrice marketPrice={userMarketPrice}>
      <article className="rounded-10 bg-background-900 flex w-full flex-col gap-16 p-20">
        <header className="flex items-center gap-8">
          <h2 className="text-18 font-weight-500 flex-1">Price Range</h2>
          <OverlappingMarketPrice
            base={base}
            quote={quote}
            marketPrice={userMarketPrice}
            setMarketPrice={setMarketPriceValue}
          />
        </header>
        <OverlappingStrategyGraph
          base={base}
          quote={quote}
          order0={order0}
          order1={order1}
          marketPrice={userMarketPrice}
          spread={spread}
          setMin={setMin}
          setMax={setMax}
        />
        {hasNoBudget(strategy) && (
          <WarningMessageWithIcon>
            Since the strategy had no budget, it will use the current market
            price to readjust the budget distribution around.
          </WarningMessageWithIcon>
        )}
      </article>
      <article className="rounded-10 bg-background-900 flex w-full flex-col gap-16 p-20">
        <header className="flex items-center gap-8">
          <h2 className="text-18 font-weight-500 flex-1">
            Edit Price Range&nbsp;
            <span className="text-white/40">
              ({quote?.symbol} per 1 {base?.symbol})
            </span>
          </h2>
          <Tooltip
            element="Indicate the strategy exact buy and sell prices."
            iconClassName="h-14 w-14 text-white/60"
          />
        </header>
        <OverlappingRange
          base={base}
          quote={quote}
          order0={order0}
          order1={order1}
          spread={spread}
          setMin={setMin}
          setMax={setMax}
        />
      </article>
      <article className="rounded-10 bg-background-900 flex w-full flex-col gap-10 p-20">
        <header className="mb-10 flex items-center gap-8 ">
          <h2 className="text-18 font-weight-500 flex-1">Edit Spread</h2>
          <Tooltip
            element="The difference between the highest bidding (Sell) price, and the lowest asking (Buy) price"
            iconClassName="h-14 w-14 text-white/60"
          />
        </header>
        <OverlappingSpread
          buyMin={Number(order0.min)}
          sellMax={Number(order1.max)}
          defaultValue={0.05}
          options={[0.01, 0.05, 0.1]}
          spread={spread}
          setSpread={setSpreadValue}
        />
      </article>
      <OverlappingAnchor
        base={base}
        quote={quote}
        anchor={anchor}
        setAnchor={setAnchorValue}
        anchorError={anchorError}
        disableBuy={aboveMarket}
        disableSell={belowMarket}
      />
      {anchor && (
        <OverlappingAction
          base={base}
          quote={quote}
          anchor={anchor}
          action={action}
          setAction={setActionValue}
          budgetValue={delta}
          setBudget={setBudget}
          resetBudgets={(anchorValue) => resetBudgets({ anchorValue })}
          buyBudget={initialBuyBudget}
          sellBudget={initialSellBudget}
          error={budgetError}
          warning={budgetWarning}
        />
      )}
      {anchor && (
        <article
          id="overlapping-distribution"
          className="rounded-10 bg-background-900 flex w-full flex-col gap-16 p-20"
        >
          <hgroup>
            <h3 className="text-16 font-weight-500 flex items-center gap-8">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-[10px] text-white/60">
                3
              </span>
              Distribution
            </h3>
            <p className="text-14 text-white/80">
              Following the above {action} amount, these are the changes in
              budget allocation
            </p>
          </hgroup>
          <OverlappingBudgetDistribution
            token={base}
            initialBudget={initialSellBudget}
            withdraw={budgetError ? '0' : withdrawSellBudget}
            deposit={budgetError ? '0' : depositSellBudget}
            balance={baseBalance ?? '0'}
          />
          <OverlappingBudgetDescription
            token={base}
            withdraw={budgetError ? '0' : withdrawSellBudget}
            deposit={budgetError ? '0' : depositSellBudget}
            balance={baseBalance ?? '0'}
            initialBudget={initialSellBudget}
          />
          <OverlappingBudgetDistribution
            token={quote}
            initialBudget={initialBuyBudget}
            withdraw={budgetError ? '0' : withdrawBuyBudget}
            deposit={budgetError ? '0' : depositBuyBudget}
            balance={quoteBalance ?? '0'}
            buy
          />
          <OverlappingBudgetDescription
            token={quote}
            withdraw={budgetError ? '0' : withdrawBuyBudget}
            deposit={budgetError ? '0' : depositBuyBudget}
            balance={quoteBalance ?? '0'}
            initialBudget={initialBuyBudget}
          />
        </article>
      )}
    </UserMarketPrice>
  );
};
