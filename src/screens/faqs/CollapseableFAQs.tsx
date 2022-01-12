import clsx from "clsx";
import { FC, Fragment, ReactEventHandler, ReactNode, useEffect, useRef, useState } from "react";

import { faChevronRight } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import useComponentSize from "../../hooks/useComponentSize";
import { useId } from "../../hooks/useId";

interface FAQQuestion {
  label: string;
  renderAnswer: () => ReactNode;
}

interface CollapseableFAQsProps {
  className?: string;
  faqs: FAQQuestion[];
  expandAll?: boolean;
}

export const CollapseableFAQs: FC<CollapseableFAQsProps> = ({ className, faqs, expandAll = false }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  let buttonId = `faq-disclosure-button-${useId()}`;
  let panelId = `faq-disclosure-panel-${useId()}`;

  return (
    <div className={className}>
      {faqs.map((faq, index) => (
        <Fragment key={faq.label}>
          {expandAll ? (
            <div className="font-bold text-lg">{faq.label}</div>
          ) : (
            <QuestionButton
              id={buttonId}
              panelId={panelId}
              label={faq.label}
              open={index === selectedIndex}
              onClick={() => setSelectedIndex(index)}
            />
          )}
          <QuestionPanel
            id={panelId}
            open={expandAll || index === selectedIndex}
            className={expandAll ? "text-base" : "text-xl"}
          >
            {faq.renderAnswer()}
          </QuestionPanel>
        </Fragment>
      ))}
    </div>
  );
};

interface QuestionButtonProps {
  open?: boolean;
  id: string;
  panelId: string;
  label: string;
  onClick: ReactEventHandler<HTMLButtonElement>;
}

const QuestionButton: FC<QuestionButtonProps> = ({ id, label, onClick, open, panelId }) => (
  <button
    id={id}
    className={clsx(
      "text-left w-full flex justify-between items-center transition-all px-4 h-20",
      open && "font-bold text-2xl border-b-2 border-primary outline-none",
      !open && " text-gray-400 text-xl border-b border-gray-300"
    )}
    style={{ outline: 0 }}
    onClick={onClick}
    aria-expanded={open}
    aria-controls={panelId}
  >
    {label} <FontAwesomeIcon className={clsx("text-gray-400", !!open && "fa-rotate-90")} icon={faChevronRight} />
  </button>
);

interface QuestionPanelProps {
  className?: string;
  id: string;
  open: boolean;
}

const QuestionPanel: FC<QuestionPanelProps> = ({ children, className, id, open }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(() => ref.current?.scrollHeight);

  // There's a timing issue with the below effect that prevents the first panel from opening until you switch to a new page and come back
  // Passing this width and height as deps fixes it
  const { width: componentWidth, height: componentHeight } = useComponentSize(ref);

  const inlineStyle = open ? { height } : { height: 0 };

  useEffect(() => {
    if (!ref.current) return;

    if (open && !height) {
      setHeight(ref.current.scrollHeight);
    }
  }, [open, height, componentWidth, componentHeight]);

  return (
    <div
      id={id}
      ref={ref}
      className={clsx("overflow-hidden transition-height ease duration-300", className)}
      style={inlineStyle}
    >
      {children}
    </div>
  );
};
