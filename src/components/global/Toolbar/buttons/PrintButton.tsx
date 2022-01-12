import { useSelector } from "react-redux";

import { faPrint } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { getPrintUrl } from "../../../../lib/selectors";
import { ToolbarButtonLink } from "../ToolbarButtonLink";

interface PrintButtonProps {
  disabled?: boolean;
}

const PrintButton = ({ disabled }: PrintButtonProps) => {
  const url = useSelector(getPrintUrl);

  if (!url) return null;

  return (
    <ToolbarButtonLink
      className="print-presentation"
      href={url}
      disabled={disabled}
      title="Print Presentation"
      data-cy="print-presentation-btn"
    >
      <FontAwesomeIcon icon={faPrint} />
    </ToolbarButtonLink>
  );
};

export default PrintButton;
