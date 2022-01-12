import { AuroraDesign } from "./../../features/aurora/aurora.types";
import { AxiosError, AxiosRequestConfig } from "axios";

import {
  Annotation,
  CalculatePricingPayload,
  PricingOperation,
  EnerfloProposalData,
  EnerfloProposalTemplate,
  SelectOption,
  ShareFormPayload,
  ShareFormResult,
  UnsavedAnnotation,
  OptimizeDesignAction,
} from "../../types";
import { makeDeleteRequest, makeGetRequest, makePostRequest } from "./helpers";

// Change the URL to point to our App instead of legacy API for demo requests
const createApiUrl = (url: string) => url.replace("api/proposals/demo/", "proposals/api/demo/");

export const fetchTemplate = async (reportHash: string, options?: AxiosRequestConfig) =>
  makeGetRequest<EnerfloProposalTemplate>(createApiUrl(`/api/proposals/${reportHash}/template`), options);

export const fetchData = async (reportHash: string, options?: AxiosRequestConfig) =>
  makeGetRequest<EnerfloProposalData>(createApiUrl(`/api/proposals/${reportHash}/data`), options);

export const postDesignOptimization = async (
  reportHash: string,
  payload: OptimizeDesignAction["data"],
  options?: AxiosRequestConfig
) =>
  makePostRequest<OptimizeDesignAction["data"], EnerfloProposalData>(
    createApiUrl(`/api/proposals/${reportHash}/optimize`),
    payload,
    options
  );

export const postSyncAuroraDesign = async (surveyId: number, designId: string, options?: AxiosRequestConfig) =>
  makePostRequest<null, EnerfloProposalData>(
    `/deal/design/aurora/status/${surveyId}/set-design/${designId}?api=true`,
    null,
    options
  );

export const getAuroraDesigns = async (surveyId: number) =>
  makeGetRequest<AuroraDesign[]>(`/api/aurora/${surveyId}/designs`);

export const postAuroraJwt = async () => makePostRequest<null, string>(`/api/aurora/jwt`, null);

export const postPricingCalculation = async <
  TOperation extends PricingOperation,
  TData = CalculatePricingPayload<TOperation>
>(
  reportHash: string,
  operation: TOperation,
  data: TData,
  options?: AxiosRequestConfig
) =>
  makePostRequest<TData, EnerfloProposalData>(createApiUrl(`/api/proposals/${reportHash}/${operation}`), data, options);

interface FetchAnnotationsResult {
  annotations: Annotation[];
}

export const fetchAnnotations = async (reportHash: string, options?: AxiosRequestConfig) =>
  makeGetRequest<FetchAnnotationsResult>(createApiUrl(`/api/proposals/${reportHash}/annotations`), options);

interface PostAnnotationResult {
  success: boolean;
  status: string;
  annotation: Annotation;
}

export const postAnnotation = async (reportHash: string, payload: UnsavedAnnotation, options?: AxiosRequestConfig) =>
  makePostRequest<UnsavedAnnotation, PostAnnotationResult>(
    createApiUrl(`/api/proposals/${reportHash}/annotation`),
    payload,
    options
  );

interface DeleteAnnotationResult {
  success: boolean;
  status: string;
  annotation: Annotation;
}

export const deleteAnnotation = async (reportHash: string, annotationId: number, options?: AxiosRequestConfig) =>
  makeDeleteRequest<{ screen: string }, DeleteAnnotationResult>(
    createApiUrl(`/api/proposals/${reportHash}/annotation/${annotationId}`),
    options
  );

export const getRateScheduleOptions = async (reportHash: string, options?: AxiosRequestConfig) =>
  makeGetRequest<{ options: SelectOption[] }>(
    createApiUrl(`/api/proposals/${reportHash}/rate-schedule-options`),
    options
  );

export const postShareForm = async (reportHash: string, payload: ShareFormPayload, options?: AxiosRequestConfig) =>
  makePostRequest<ShareFormPayload, ShareFormResult>(
    createApiUrl(`/api/proposals/${reportHash}/share`),
    payload,
    options
  );

export interface ParsedApiError {
  statusCode?: number;
  message: string;
}

export function parseApiError(error: AxiosError<any>): ParsedApiError {
  const { response } = error;

  const msg = response?.data?.error ?? response?.data?.message ?? response?.statusText ?? "Something went wrong";

  return {
    statusCode: response?.status,
    message: msg,
  };
}
