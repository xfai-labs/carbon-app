import { m, Variants } from 'libs/motion';
import { FC, ReactNode, useRef, useState } from 'react';
import { ReactComponent as IconTooltip } from 'assets/icons/tooltip.svg';
import { usePopper } from 'react-popper';

type Props = {
  children: ReactNode;
  element?: string | ReactNode;
  delay?: number;
};

let timeout: NodeJS.Timeout;
let prevPopFunc: Function = () => {};

export const Tooltip: FC<Props> = ({ children, element, delay = 300 }) => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const itemRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const { styles } = usePopper(itemRef.current, tooltipRef.current);

  const handleOnMouseEnter = () => {
    prevPopFunc();
    clearInterval(timeout);
    setIsOpen(true);
  };

  const handleOnMouseLeave = () => {
    prevPopFunc = () => setIsOpen(false);
    timeout = setTimeout(() => setIsOpen(false), delay);
  };

  return (
    <m.div
      initial={false}
      animate={isOpen ? 'open' : 'closed'}
      className={`relative ${isOpen ? 'z-10' : 'z-0'}`}
    >
      <m.div
        ref={itemRef}
        onMouseEnter={() => handleOnMouseEnter()}
        onMouseLeave={() => handleOnMouseLeave()}
        onClick={() => setIsOpen(!isOpen)}
      >
        {element ? element : <IconTooltip />}
      </m.div>
      <m.div
        ref={tooltipRef}
        className={
          'absolute -ml-[125px] mt-10 min-w-[275px] rounded border border-b-lightGrey bg-primary-500/10 px-24 py-16 shadow-lg backdrop-blur-2xl dark:border-darkGrey dark:bg-darkGrey/30'
        }
        onMouseEnter={() => handleOnMouseEnter()}
        onMouseLeave={() => handleOnMouseLeave()}
        variants={menuVariants}
        style={{
          ...styles.popper,
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
      >
        {children}
      </m.div>
    </m.div>
  );
};

const menuVariants: Variants = {
  open: {
    opacity: 1,
    scale: 1,
    y: '0px',
    x: '0px',
    transition: {
      type: 'spring',
      bounce: 0,
      duration: 0.2,
      delayChildren: 0,
      staggerChildren: 0,
    },
  },
  closed: {
    opacity: 0,
    scale: 0.8,
    y: '-40px',
    x: '-30px',
    transition: {
      type: 'spring',
      bounce: 0,
      duration: 0.2,
    },
  },
};
