import { FC } from "react";
import { useSelector } from "react-redux";

import { canUserEditProposal, getIsProposalLocked } from "../lib/selectors";

const HideLocked: FC = ({ children }) => {
  const locked = useSelector(getIsProposalLocked);
  const canEdit = useSelector(canUserEditProposal);

  if (locked || !canEdit) return null;

  return <>{children}</>;
};

export default HideLocked;
