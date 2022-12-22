import { Button } from 'components/Button';
import { Page } from 'components/Page';
import { SearchInput } from 'components/SearchInput';
import { StrategyBlock } from 'components/StrategyBlock';
import { StrategyBlockCreate } from 'components/StrategyBlock/create';
import { m, mListVariant } from 'motion';
import { useGetUserStrategies } from 'queries';
import { FC, useMemo, useState } from 'react';
import { Link, PathNames } from 'routing';
import { useWeb3 } from 'web3';
import { WalletConnect } from 'components/WalletConnect';
import { FilterSort, StrategyFilter, StrategySort } from './FilterSort';

export const StrategiesPage = () => {
  const { user } = useWeb3();

  return user ? <StrategyContent /> : <WalletConnect />;
};

const StrategyContent = () => {
  const strategies = useGetUserStrategies();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState(StrategySort.Recent);
  const [filter, setFilter] = useState(StrategyFilter.All);

  const filteredStrategies = useMemo(() => {
    return strategies.data?.filter(
      (strategy) =>
        strategy.order0.token.symbol
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        strategy.order1.token.symbol
          .toLowerCase()
          .includes(search.toLowerCase())
    );
  }, [search, strategies.data]);

  if (strategies && strategies.data && strategies.data.length === 0)
    return <CreateFirstStrategy />;

  return (
    <Page
      title={'Strategies'}
      widget={
        <StrategyPageTitleWidget
          sort={sort}
          filter={filter}
          setSort={setSort}
          setFilter={setFilter}
          search={search}
          setSearch={setSearch}
          showFilter={!!(strategies.data && strategies.data.length > 2)}
        />
      }
    >
      <m.div
        className={'grid grid-cols-1 gap-25 md:grid-cols-3'}
        variants={mListVariant}
        initial={'hidden'}
        animate={'visible'}
      >
        {strategies.isLoading ? (
          <>
            {[...Array(3)].map((_, index) => (
              <div key={index} className="loading-skeleton h-[665px] w-full" />
            ))}
          </>
        ) : (
          <>
            {filteredStrategies?.map((s) => (
              <StrategyBlock key={s.id} strategy={s} />
            ))}

            <StrategyBlockCreate />
          </>
        )}
      </m.div>
    </Page>
  );
};

const StrategyPageTitleWidget: FC<{
  search: string;
  setSearch: (value: string) => void;
  showFilter: boolean;
  sort: StrategySort;
  filter: StrategyFilter;
  setSort: (sort: StrategySort) => void;
  setFilter: (sort: StrategyFilter) => void;
}> = ({ search, setSearch, showFilter, sort, filter, setSort, setFilter }) => {
  return (
    <div className="flex items-center gap-20">
      {showFilter && (
        <>
          <SearchInput
            value={search}
            setValue={setSearch}
            className="h-40 w-full"
          />
          <FilterSort
            sort={sort}
            filter={filter}
            setSort={setSort}
            setFilter={setFilter}
          />
        </>
      )}
      <Link to={PathNames.createStrategy}>
        <Button variant="secondary">Create Strategy</Button>
      </Link>
    </div>
  );
};

const CreateFirstStrategy = () => {
  return (
    <div className="h-full p-20">
      <StrategyBlockCreate
        title="Create Your First Strategy"
        className="w-[270px] gap-[32px] text-center text-36"
      />
    </div>
  );
};
