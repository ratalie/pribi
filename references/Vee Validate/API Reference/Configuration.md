---
title: Configuration
source: https://vee-validate.logaretm.com/v4/api/configuration/
author:
published:
created: 2025-10-21
description: VeeValidate Global Config Reference
tags:
  - clippings
updated: 2025-10-21T08:20
---
vee-validate exposes global configs to help with a few repeated or certain behaviors that needs to be set app-wide.

## Config Options

| Option | Type | Description |
| --- | --- | --- |
| bails | `boolean` | Whether to run validations to completion or quit on the first, default is `true`. Doesn’t affect `yup` schemas |
| generateMessage | `(ctx: FieldValidationMetaInfo) => string` | A message generator function for i18n libraries and a fallback for rules with no messages. For more information about the [`FieldValidationMetaInfo`](https://github.com/logaretm/vee-validate/blob/main/packages/shared/types.ts#L1-L9) type and the purpose of this, see the [Global Message Generator Guide](https://vee-validate.logaretm.com/v4/guide/i18n#global-message-generator) |
| validateOnBlur | `boolean` | If validation should be triggered on `blur` event, default is `true` |
| validateOnChange | `boolean` | If validation should be triggered on `change` event, default is `true` |
| validateOnInput | `boolean` | If validation should be triggered on `input` event, default is `false` |
| validateOnModelUpdate | `boolean` | If validation should be triggered on `update:modelValue` (v-model) event, default is `true` |

This is slightly verbose, but this gives you exact control on which events triggers validation.

## Updating The Config

You can change the global config using the `configure` function exposed by vee-validate passing any options that you need to change. You can call that function at any time during runtime but the changes will take effect for new `Field` and `useField` afterwards.

Here is an example:

```
jsimport { configure } from 'vee-validate';

configure({

  bails: false,

});
```

tip

Note that the following config do not affect `useField`, they only apply to the `<Field />` component:

- `validateOnBlur`
- `validateOnChange`
- `validateOnInput`
- `validateOnModelUpdate`

[Edit This Page on GitHub](https://github.com/logaretm/vee-validate/edit/main/docs/src/pages/api/configuration.mdx)

[Sponsor](https://github.com/sponsors/logaretm)