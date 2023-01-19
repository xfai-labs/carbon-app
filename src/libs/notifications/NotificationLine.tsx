import { FC } from 'react';
import { Notification, NotificationStatus } from 'libs/notifications/types';
import { ReactComponent as IconLink } from 'assets/icons/link.svg';
import { ReactComponent as IconTimes } from 'assets/icons/times.svg';
import { ReactComponent as IconCheck } from 'assets/icons/check.svg';
import { getExplorerLink } from 'utils/blockExplorer';
import { unix } from 'libs/dayjs';
import { useNotifications } from 'libs/notifications';
import { useInterval } from 'hooks/useInterval';

const StatusIcon = (status: NotificationStatus) => {
  switch (status) {
    case 'pending':
      return (
        <div className="relative flex items-center justify-center">
          <div className="h-38 w-38 animate-spin rounded-full border-t border-r border-white" />
        </div>
      );
    case 'success':
      return (
        <div className="flex flex h-38 w-38 items-center justify-center rounded-full bg-success-500/10">
          <IconCheck className="w-11 text-success-500" />
        </div>
      );
    case 'failed':
      return (
        <div className="flex flex h-38 w-38 items-center justify-center rounded-full bg-error-500/10">
          <IconTimes className="w-11 text-error-500" />
        </div>
      );
  }
};

const getTitleByStatus = (n: Notification) => {
  switch (n.status) {
    case 'pending':
      return n.title;
    case 'success':
      return n.successTitle || n.title;
    case 'failed':
      return n.failedTitle || n.title;
  }
};

const getDescriptionByStatus = (n: Notification) => {
  switch (n.status) {
    case 'pending':
      return n.description;
    case 'success':
      return n.successDesc || n.description;
    case 'failed':
      return n.failedDesc || n.description;
  }
};

export const NotificationLine: FC<{
  notification: Notification;
  isAlert?: boolean;
}> = ({ notification, isAlert }) => {
  const { removeNotification, dismissAlert } = useNotifications();

  const handleCloseClick = () => {
    if (isAlert) {
      dismissAlert(notification.id);
    } else {
      removeNotification(notification.id);
    }
  };

  useInterval(
    () => dismissAlert(notification.id),
    isAlert ? 8000 : null,
    false
  );

  return (
    <div>
      <div className="flex gap-16">
        <div className="self-center">{StatusIcon(notification.status)}</div>
        <div className="w-full">
          {getTitleByStatus(notification)}
          <div className="text-14 text-charcoal/80 dark:text-white/80">
            <div>{getDescriptionByStatus(notification)}</div>
            {notification.txHash && (
              <a
                href={getExplorerLink('tx', notification.txHash)}
                target="_blank"
                rel="noreferrer"
                className={'mt-10 flex items-center font-weight-500'}
              >
                View on Etherscan <IconLink className="ml-6 w-14" />
              </a>
            )}
          </div>
        </div>

        <div className={'flex flex-col items-end justify-between'}>
          <div className="text-secondary whitespace-nowrap text-12 font-weight-500">
            {unix(notification.timestamp).fromNow(true)}
          </div>
          <button
            className="text-12 font-weight-500"
            onClick={handleCloseClick}
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};