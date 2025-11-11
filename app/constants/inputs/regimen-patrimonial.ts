import { RegimenPatrimonialEnum } from "~/types/enums/RegimenPatrimonialEnum";

export const regimenPatrimonialOptions = Object.values(RegimenPatrimonialEnum).map(
  (regimen, index) => ({
    id: index + 1,
    value: regimen,
    label: regimen,
  })
);
