import includes from "lodash/includes";
import without from "lodash/without";
import React, { useMemo } from "react";
import { Controller, FormProvider } from "react-hook-form";
import { useSelector } from "react-redux";
import isEmail from "validator/lib/isEmail";

import { WithGlobalDialogProps } from "../../../features/dialogs";
import { getShareLink } from "../../../lib/selectors";
import { Button } from "../../Button";
import SlideDownDialog from "../../SlideDownDialog";
import Editor from "./EmailEditor";
import { Input, InputLabel } from "./Inputs";
import TagsInput from "./TagsInput";
import { useShareForm } from "./useShareForm";

const ShareModal = ({ open, onClose, afterLeave }: WithGlobalDialogProps) => {
  const shareLink = useSelector(getShareLink);

  const { form, onSubmit, onReset, error } = useShareForm({});

  const { isSubmitting, isSubmitSuccessful } = form.formState;
  const successfulSave = useMemo(() => isSubmitSuccessful, [isSubmitSuccessful]);

  return (
    <SlideDownDialog open={open} onClose={onClose} afterLeave={afterLeave} data-cy="share-modal">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col" autoComplete="off" data-cy="share-form">
          <div className="flex-grow flex flex-col">
            {successfulSave ? (
              <div className="flex justify-center">
                <div className="py-24 text-xl">Your email has been sent</div>
              </div>
            ) : (
              <div>
                <div className="p-4 mb-2 border border-cool-gray-300 bg-cool-gray-200">
                  <div className="text-xl">Share this proposal with a customer</div>
                  <div className="text-sm">
                    This email below will be sent to the customer with a link so they can view the proposal
                  </div>
                  {!!shareLink && (
                    <div className="text-sm mt-3 text-gray-700">
                      This customer's proposal link:{" "}
                      <span className="font-bold text-primary">
                        <a target="_blank" href={shareLink} rel="noreferrer">
                          {shareLink}
                        </a>
                      </span>
                    </div>
                  )}
                </div>
                <div className="my-5">
                  <InputLabel htmlFor="share--email">Customer Email</InputLabel>
                  <Controller name="email" render={({ field }) => <Input {...field} id="share--email" />} />
                </div>
                <div className="my-5">
                  <InputLabel htmlFor="share--cc_emails">CC Emails</InputLabel>
                  <Controller
                    name="cc_emails"
                    defaultValue={[]}
                    render={({ field: { name, onChange, value } }) => {
                      const handleAddTag = (tag: string) => {
                        if (includes(value, tag)) return;

                        onChange([...value, tag]);
                      };

                      const handleDeleteTag = (tag: string) => {
                        onChange(without(value, tag));
                      };

                      const validateTag = (tag: string) => isEmail(tag);

                      return (
                        <TagsInput
                          id="share--cc_emails"
                          name={`tags-input--${name}`}
                          defaultTags={value}
                          onAddTag={handleAddTag}
                          onDeleteTag={handleDeleteTag}
                          validateTag={validateTag}
                        />
                      );
                    }}
                  />
                  <div className="text-xs text-gray-600 mt-1">Additional emails you want CC'd.</div>
                </div>
                <div className="my-5">
                  <InputLabel htmlFor="share--subject">Email Subject</InputLabel>
                  <Controller
                    name="subject"
                    render={({ field }) => <Input {...field} id="share--subject" autoComplete="off" />}
                  />
                </div>
                <div className="my-5">
                  <InputLabel>Email Content</InputLabel>
                  <Editor name="body" shareLink={shareLink as string} />
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col mt-2">
            {!!error && (
              <div className="flex justify-end text-sm text-error mb-2">
                There was an error sending your email. Please try again.
              </div>
            )}
            <div className="flex justify-between">
              <button
                type="button"
                id="share--cancel"
                onClick={onClose}
                className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
              >
                {successfulSave ? "Close" : "Cancel"}
              </button>
              {successfulSave && (
                <Button
                  id="share--send-another"
                  color="primary"
                  className="transition duration-300 ease-in-out"
                  onClick={onReset}
                >
                  Send Another
                </Button>
              )}
              {!successfulSave && (
                <Button
                  type="submit"
                  id="share--submit"
                  color="primary"
                  className="transition duration-300 ease-in-out"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sharing..." : "Share"}
                </Button>
              )}
            </div>
          </div>
        </form>
      </FormProvider>
    </SlideDownDialog>
  );
};

export default ShareModal;
