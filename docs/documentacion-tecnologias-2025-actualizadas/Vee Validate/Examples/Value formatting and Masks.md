---
title: Value formatting and Masks
source: https://vee-validate.logaretm.com/v4/examples/value-formatting/
author:
published:
created: 2025-10-21
description: using vee-validate with masked and formatted inputs
tags:
  - clippings
updated: 2025-10-21T08:14
---
Some inputs may have a mask applied to them, that is their value is displayed in a different way than the actual value to make it more friendly towards the user.

For example, a currency input could insert a thousand separator to make it easier for the user to enter and read large numbers.

```
sh# hard to read

10000000

# Much easier

10,000,000
```

It can be confusing as to how would you run your numeric validation rules on such inputs. The following examples show you how to handle such inputs by separating the “display value” from the actual value.

## Currency Format Example

The following example integrates [`vue-currency-input`](https://github.com/dm4t2/vue-currency-input) using the composition API. While it is still possible to do it with the `<Field />` component, it is significantly easier to work with the composition API in this case.

The main key to getting this right is to sync the value in multiple formats, the formatted one, and the non-formatted value.

Ideally, vee-validate should be synced with the non-formatted one, you can do this by updating the value manually using `setValue` or `handleChange`.

```vue
<script setup lang="ts">
import { Form } from 'vee-validate';
import * as Yup from 'yup';
import CurrencyInput from './components/CurrencyInput.vue';

const schema = Yup.object({
  amount: Yup.number().required().max(1000).min(100),
});

const currencyOptions = {
  currency: 'USD',
};

const initialValues = { amount: 10000 };
</script>

<template>
  <h1>Currency Example</h1>
  <p>
    The `&lt;CurrencyInput /&gt;` component integrates both vee-validate and
    `vue-currency-input` to achieve validatable formattable currency input.<br />
    <br />
    This allows you to still validate the value as a number while having freedom
    to make it more friendly towards the user.
  </p>

  <Form :validation-schema="schema" :initial-values="initialValues">
    <CurrencyInput name="amount" :options="currencyOptions" />
  </Form>
</template>

```