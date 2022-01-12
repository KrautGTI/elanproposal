import { useSelector } from "react-redux";

import { faHomeAlt } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { getDealUrl } from "../../../../lib/selectors";
import { ToolbarButtonLink } from "../ToolbarButtonLink";

interface GoToDealButtonProps {
  disabled?: boolean;
}

const GoToDealButton = ({ disabled }: GoToDealButtonProps) => {
  const dealUrl = useSelector(getDealUrl);

  if (!dealUrl) return null;

  return (
    <ToolbarButtonLink
      className="go-home"
      href={dealUrl}
      disabled={disabled}
      title="Go to Survey"
      data-cy="goto-deal-btn"
    >
      <FontAwesomeIcon icon={faHomeAlt} />
    </ToolbarButtonLink>
  );
};

export default GoToDealButton;
