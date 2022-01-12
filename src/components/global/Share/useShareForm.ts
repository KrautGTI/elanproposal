import { yupResolver } from "@hookform/resolvers/yup";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import * as yup from "yup";

import { postShareForm } from "../../../lib/api/proposal-api";
import { getCustomer, getReportHash, getSalesRep, getShareLink } from "../../../lib/selectors";
import { Agent, Customer, ShareFormPayload } from "../../../types";
import { customButtonStylesString } from "./EmailEditor";

const getDefaultEmailBody = ({
  agent,
  customer,
  shareLink,
}: {
  agent: Agent | undefined;
  customer: Customer;
  shareLink: string | undefined;
}) => {
  const heading = `<p>Hi ${customer.firstName},</p>`;
  const description = `<p>Please use the button below to view your solar proposal</p>`;
  const link = `<a href="${shareLink}" alt="View Solar Energy Project" style="${customButtonStylesString}">View Solar Energy Project >></a>`;
  let signature = `<p>Thanks!</p>`;

  if (agent) {
    const agentName = `<p>${agent.firstName} ${agent.lastName}</p>`;
    const agentEmail = `<p>${agent.email}</p>`;
    const agentPhone = `<p>Phone: ${agent.phone.national}</p>`;
    signature = `${signature}${agentName}${agentEmail}${agentPhone}`;
  }

  return `${heading}${description}<br />${link}<br />${signature}`;
};

interface UseShareFormOptions {
  onSubmitSuccess?: () => {};
}

const shareSchema = yup.object({
  subject: yup.string().defined(),
  body: yup.string().defined(),
  email: yup.string().defined(),
  cc_emails: yup.array(yup.string().defined()).defined(),
});

export const useShareForm = ({ onSubmitSuccess }: UseShareFormOptions) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState(false);

  const reportHash = useSelector(getReportHash);
  const customer = useSelector(getCustomer);
  const agent = useSelector(getSalesRep);
  const shareLink = useSelector(getShareLink);

  const defaultValues = useMemo(
    () => ({
      subject: `${customer?.firstName}, your solar proposal is ready!`,
      body: getDefaultEmailBody({ customer, agent, shareLink }),
      email: customer.email ?? "",
      cc_emails: [],
    }),
    [agent, customer, shareLink]
  );

  const formMethods = useForm<ShareFormPayload>({
    mode: "all",
    defaultValues,
    resolver: yupResolver(shareSchema),
  });
  const { reset } = formMethods;

  const resetForm = () => reset(defaultValues);

  const onSubmit = async (values: ShareFormPayload) => {
    setError(false);

    try {
      await postShareForm(reportHash, values);
    } catch (e) {
      setError(true);
    }

    onSubmitSuccess?.();
  };

  return {
    form: formMethods,
    onSubmit,
    onReset: resetForm,
    error,
  };
};
