import { CarbonEvents, GTMData, SendEventFn } from './types';
import { convertCase } from 'utils/helpers';

declare global {
  interface Window {
    dataLayer: GTMData[];
  }
}

const sendGTM = (data: GTMData) => {
  if (window.dataLayer) {
    window.dataLayer.push(data);
  }
};

export const sendEvent: SendEventFn = (type, event, data) => {
  const snakeCaseEvent = convertCase(event, true);
  const dataObj = data ? data : {};

  switch (type) {
    case 'general': {
      return sendGTM({
        event: `PV`,
        event_properties: {},
        page: dataObj,
        wallet: {},
      });
    }
    case 'wallet': {
      return sendGTM({
        event: `CE ${snakeCaseEvent}`,
        event_properties: {},
        wallet: dataObj,
      });
    }
    default:
      return sendGTM({
        event: `CE ${snakeCaseEvent}`,
        event_properties: dataObj,
        wallet: {},
      });
  }
};

export const carbonEvents: CarbonEvents = {
  general: {
    changePage: ({ referrer, test }) => {
      console.log('event', 'changePage', test, referrer);

      sendEvent('general', 'changePage', {
        page_referrer_spa: referrer ? referrer : null,
      });
    },
  },
  wallet: {
    walletConnect: ({ name, tos }) => {
      sendEvent('wallet', 'walletConnect', {
        wallet_name: name,
        tos_approve: tos,
      });
    },
  },
};
