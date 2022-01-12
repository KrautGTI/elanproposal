import clsx from "clsx";
import numeral from "numeral";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import { faChevronDoubleUp } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { toggleArrayDataTable } from "../../../../features/designPortal";
import { getArrayData, getArrayDataTableExpanded } from "../../../../lib/selectors";
import { PingAnimation } from "../../../PingAnimation";

interface ArrayDataTableProps {
  parentHeight?: number;
  isLocked?: boolean;
}

const ArrayDataTable = ({ parentHeight, isLocked }: ArrayDataTableProps) => {
  const arrayData = useSelector(getArrayData);
  const isExpanded = useSelector(getArrayDataTableExpanded) && !isLocked;
  const dispatch = useDispatch();

  const toggle = e => {
    dispatch(toggleArrayDataTable());
    e.stopPropagation();
  };

  return (
    <Wrapper
      data-cy="array-data-table"
      className={clsx(
        "bg-white shadow rounded-lg ease-in-out transition duration-500 w-80 hover:cursor-default",
        isExpanded ? "max-h-screen delay-150" : "max-h-14"
      )}
      style={{ bottom: `${(parentHeight || 130) - 25}px` }}
      onClick={e => e.stopPropagation()}
    >
      <button
        type="button"
        data-cy="array-data-table-toggle"
        onClick={toggle}
        className={clsx("w-full mb-4 px-12 pt-4 rounded-lg outline-none no-focus-ring", isLocked && "opacity-40")}
        disabled={isLocked}
      >
        <FontAwesomeIcon
          className={clsx("opacity-50 transition delay-500 duration-500", isExpanded && "fa-rotate-180")}
          icon={faChevronDoubleUp}
        />
      </button>
      <div className="px-8 pb-6">
        <table
          className={clsx(
            "text-sm w-64 duration-300 transition-opacity",
            isExpanded ? "opacity-1 delay-300" : "opacity-0"
          )}
        >
          <thead className="border-blue-gray-200 border-b-2 mb-4">
            <tr>
              <th className="text-left p-1">Array</th>
              <th className="text-right p-1">Max</th>
              <th className="text-right p-1">Active</th>
              <th className="text-right p-1">Production</th>
            </tr>
          </thead>
          <tbody data-cy="array-data-table-body" className="pt-4">
            {arrayData?.map(array => (
              <tr key={array.name} className={clsx(array.is_enabled === false && "opacity-30")}>
                <td className="text-left pb-1">{array.name}</td>
                <td className="text-right pb-1">{array.max_panel_count}</td>
                <td className="text-right pb-1">
                  <ValueWithLoader value={numeral(array.active_panel_count || 0).format("0,0")} />
                </td>
                <td className="text-right pb-1">
                  <ValueWithLoader value={numeral(array.active_panel_production || 0).format("0,0")} />
                </td>
              </tr>
            ))}
            {arrayData && arrayData.length < 1 && <p className="my-4">No arrays.</p>}
          </tbody>
        </table>
      </div>
    </Wrapper>
  );
};

const ValueWithLoader = ({ value }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    let timeoutId = window.setTimeout(() => {
      setLoading(false);
    }, 3200);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [value]);

  return (
    <span className="grid">
      <PingAnimation style={{ gridColumn: 1, gridRow: 1 }} className={clsx("h-4 w-4 ml-auto", !loading && "hidden")} />
      <span
        style={{ gridColumn: 1, gridRow: 1 }}
        className={clsx("transition-opacity duration-1000", loading ? "opacity-0" : "opacity-1")}
      >
        {value}
      </span>
    </span>
  );
};

export default ArrayDataTable;

const Wrapper = styled.div`
  position: absolute;
  transform: translate(-50%, 0%) translateZ(-5px);
  left: 50%;
  transition-property: max-height;

  ${props => props.theme.breakpoints.up("md")} {
    transform: translateZ(-5px);
    left: auto;
  }
`;
