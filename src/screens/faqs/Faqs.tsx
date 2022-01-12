import clsx from "clsx";
import React, { FC, useMemo, useState } from "react";
import styled from "styled-components";

import TitleLayout from "../../components/layouts/TitleLayout";

import type { DeckScreen } from "../../types";
import { faqs } from "./constants";

const NoopComponent: FC = () => null;

interface FaqsProps {
  heading?: string | undefined;
  forceSelect?: string;
}

const Faqs: DeckScreen<FaqsProps> = ({ id, heading, forceSelect }) => {
  const [selected, setSelected] = useState(() => forceSelect ?? faqs[0].id);

  const Component: any = useMemo(() => faqs.find(faq => faq.id === selected)?.component ?? NoopComponent, [selected]);

  return (
    <TitleLayout title={heading ?? "FAQ"}>
      <div className="h-full w-full flex px-4">
        <div className="flex flex-col mr-6 mt-3">
          {faqs.map(faq => (
            <CircleWithIcon
              key={faq.id}
              title={faq.title}
              icon={faq.icon}
              active={faq.id === selected}
              onClick={forceSelect ? undefined : () => setSelected(faq.id)}
            />
          ))}
        </div>
        <div className="flex-grow rounded-lg shadow-xl bg-white p-12">
          <Component expandAll={!!forceSelect} />
        </div>
      </div>
    </TitleLayout>
  );
};

export default Faqs;

function CircleWithIcon(props: any) {
  return (
    <button
      type="button"
      className="px-6 py-2 mb-7 flex flex-col items-center focus:ring-opacity-10 rounded-lg"
      onClick={props.onClick}
    >
      <IconBubble
        className={clsx(
          "rounded-full flex items-center justify-center shadow-md transition-colors focus:outline-none",
          props.active ? "bg-primary text-white" : "bg-white text-gray-300"
        )}
        style={{ height: 69, width: 69 }}
        tabIndex={-1}
      >
        <props.icon width={34.5} height={34.5} />
      </IconBubble>
      <div
        className={clsx(
          "whitespace-nowrap text-center mt-2 transition-colors",
          props.active ? "text-primary" : "text-gray-400"
        )}
      >
        {props.title}
      </div>
    </button>
  );
}

const IconBubble = styled.div`
  button:focus & {
    --tw-shadow-color: rgb(var(--rgb-primary));
    --tw-shadow: 0 -1px 6px -1px var(--tw-shadow-color), 0 2px 4px -1px var(--tw-shadow-color);
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
  }
`;
