import { FC } from 'react';
import { NewTabLink, externalLinks } from 'libs/routing';
import { ReactComponent as LogoCarbonDeFi } from 'assets/logos/carbondefi.svg';
import { ReactComponent as LogoCarbon } from 'assets/logos/carbon.svg';

export const Footer: FC = () => {
  return (
    <footer className="border-background-800 mb-80 flex items-center border-t bg-black px-20 py-24 md:mb-0">
      <div className="container flex flex-row items-center justify-between">
        <div className="flex flex-row items-center space-x-20">
          <LogoCarbon className="h-30 w-30" />
          <span className="h-50 block w-1 bg-white/10"></span>
          <NewTabLink
            aria-label="Powered By CarbonDeFi"
            to={externalLinks.carbonHomepage}
            className="text-12 flex flex-col space-y-5 text-white/40"
          >
            <span>Powered by</span>
            <LogoCarbonDeFi className="w-[100px] text-white" />
          </NewTabLink>
        </div>
        <div>
          <span className="text-16 font-weight-400 text-white/60">
            @{new Date().getFullYear()} XFAI
          </span>
        </div>
      </div>
    </footer>
  );
};
