import has from "lodash/has";
import { GetServerSideProps, NextPage } from "next";
import { NextSeo } from "next-seo";
import dynamic from "next/dynamic";
import React from "react";
import { useSelector } from "react-redux";

const ProposalDeck = dynamic(() => import("../../src/ProposalDeck"));

interface ServerSideProps {
  reportHash: string;
  printMode: boolean;
}

const ProposalApp: NextPage<ServerSideProps> = ({ reportHash, printMode }) => {
  return (
    <>
      <ProposalDeck reportHash={reportHash} printMode={printMode} />
      <CustomPageTitle />
    </>
  );
};

export default ProposalApp;

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ctx => {
  const props: ServerSideProps = {
    reportHash: ctx.query.reportHash as string,
    printMode: has(ctx.query, "print-pdf"),
  };

  return {
    props,
  };
};

function CustomPageTitle() {
  // Can't use the repeatable selectors here because proposal might not be defined yet
  const customer = useSelector(state => state.proposal.data?.customer);

  return <NextSeo title={customer ? `${customer.firstName} ${customer.lastName}` : undefined} />;
}
