import { faChevronDoubleRight } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector } from "react-redux";
import { getApplyNowUrl } from "../../../../lib/selectors";

import { ToolbarButtonLink } from "../ToolbarButtonLink";

interface GoToFinancingButtonProps {
  disabled?: boolean;
}

const GoToFinancingButton = ({ disabled }: GoToFinancingButtonProps) => {
  const applyNowUrl = useSelector(getApplyNowUrl);

  if (!applyNowUrl) return null;

  return (
    <ToolbarButtonLink
      className="go-financing"
      href={applyNowUrl}
      disabled={disabled}
      title="Go to Financing"
      data-cy="goto-financing-btn"
    >
      <FontAwesomeIcon icon={faChevronDoubleRight} />
    </ToolbarButtonLink>
  );
};

export default GoToFinancingButton;
