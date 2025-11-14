import { officeOptions } from "./office-options";
import { societyTypeOptions } from "./society-types";

type Primitive = string | number | null | undefined;

const toComparable = (value: Primitive): string => {
  if (value === null || value === undefined) return "";
  return String(value).trim();
};

const toComparableUpper = (value: Primitive): string => toComparable(value).toUpperCase();

export const normalizeTypeSocietyCode = (value: Primitive): string => {
  const raw = toComparable(value);
  if (!raw) return "";
  const upper = raw.toUpperCase();

  const match =
    societyTypeOptions.find(
      (option) =>
        option.acronimo.toUpperCase() === upper ||
        option.label.toUpperCase() === upper ||
        option.name.toUpperCase() === upper ||
        toComparableUpper(option.value) === upper
    ) ??
    societyTypeOptions.find((option) => String(option.id) === raw);

  return match?.acronimo ?? raw;
};

export const getTypeSocietyLabel = (value: Primitive): string => {
  const code = normalizeTypeSocietyCode(value);
  if (!code) return "";
  const option = societyTypeOptions.find(
    (societyOption) => societyOption.acronimo === code
  );
  return option?.label ?? code;
};

export const normalizeRegistryOfficeCode = (value: Primitive): string => {
  const raw = toComparable(value);
  if (!raw) return "";
  const upper = raw.toUpperCase();

  const match =
    officeOptions.find(
      (option) =>
        option.acronimo.toUpperCase() === upper ||
        option.label.toUpperCase() === upper ||
        option.name.toUpperCase() === upper ||
        toComparableUpper(option.value) === upper
    ) ??
    officeOptions.find((option) => String(option.id) === raw);

  return match?.acronimo ?? raw;
};

export const getRegistryOfficeLabel = (value: Primitive): string => {
  const code = normalizeRegistryOfficeCode(value);
  if (!code) return "";
  const option = officeOptions.find((officeOption) => officeOption.acronimo === code);
  return option?.label ?? code;
};

