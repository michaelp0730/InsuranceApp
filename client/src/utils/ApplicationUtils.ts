import { v4 as uuidv4, validate as uuidValidate } from "uuid";

export const generateApplicationId = (): string => {
  const newId = uuidv4();
  return newId;
};

export const validateApplicationId = (appId: string | null): boolean =>
  appId ? uuidValidate(appId) : false;

export const addQueryStringToUrl = (
  url: string,
  params: { [key: string]: string | number }
): string => {
  const urlObj = new URL(url);

  for (const [key, value] of Object.entries(params)) {
    urlObj.searchParams.set(key, value.toString());
  }

  return urlObj.toString();
};

export const updateUrl = (newUrl: string): void =>
  window.history.pushState(null, "", newUrl);

export const formatDateForDatabase = (date: Date): string => {
  const formattedDate = new Date(date).toISOString().split("T")[0];
  return formattedDate;
};
