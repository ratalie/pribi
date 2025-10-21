---
title: Cross-Field Validation
source: https://vee-validate.logaretm.com/v4/examples/cross-field-validation/
author:
published:
created: 2025-10-21
description: Validating input values depending on other inputs' values
tags:
  - clippings
updated: 2025-10-21T08:12
---
This example shows how to create a password-confirmation-like rules using either `yup` or global validators.

```vue
<script setup lang="ts">
import { Field, Form, ErrorMessage, defineRule } from 'vee-validate';
import * as yup from 'yup';

const schema = yup.object().shape({
  password: yup.string().min(5).required(),
  passwordConfirmation: yup
    .string()
    .required()
    .oneOf([yup.ref('password')], 'Passwords do not match'),
});

function onSubmit(values) {
  alert(JSON.stringify(values, null, 2));
}
</script>

<template>
  <div>
    <h1>vee-validate cross-field Validation</h1>

    <Form @submit="onSubmit" :validation-schema="schema">
      <p>
        These inputs use `yup` to perform validation. The confirmation field
        makes use of <strong>`yup.string.oneOf`</strong> rule with
        <strong>`Yup.ref`</strong> to target another field's value.
      </p>

      <div>
        <label for="password">Password</label>
        <Field id="password" name="password" type="password" />
        <ErrorMessage name="password" />
      </div>

      <div>
        <label for="passwordConfirmation">Confirm Password </label>
        <Field
          id="passwordConfirmation"
          name="passwordConfirmation"
          type="password"
        />
        <ErrorMessage name="passwordConfirmation" />
      </div>

      <button type="submit">Submit</button>
    </Form>
  </div>
</template>

```