import { v4 as uuidv4, validate as uuidValidate } from "uuid";

export const generateApplicationId = (): string => {
  const newId = uuidv4();
  return newId;
};

export const validateApplicationId = (appId: string | null): boolean =>
  appId ? uuidValidate(appId) : false;
