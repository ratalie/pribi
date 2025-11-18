---
title: Async Validation
source: https://vee-validate.logaretm.com/v4/examples/async-validation/
author:
published:
created: 2025-10-21
description: Using async validation with vee-validate
tags:
  - clippings
updated: 2025-10-21T08:11
---
This is an example of field that uses an async rule to check if an email is available.

```vue
<script setup lang="ts">
import { Field, Form, ErrorMessage } from 'vee-validate';

/**
 * Simulates an API request
 */
const mockApiRequest = (value) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(value === 'test@example.com');
    }, 1000);
  });
};

function onSubmit(values) {
  alert(JSON.stringify(values, null, 2));
}

async function validateEmail(value) {
  const result = await mockApiRequest(value);

  return result ? true : 'This email is already taken';
}
</script>

<template>
  <div>
    <h1>vee-validate Async Validation</h1>
    <p>
      This input uses an async validation rule that checks if the email is taken
      or not, for simulation purposes `<strong>test@example.com</strong>` is a
      valid email you can try.

      <br />
      <br />
      Note that validation is lazy by default so when you leave the input or
      click `submit`.
    </p>

    <Form @submit="onSubmit">
      <label for="email">Email</label>
      <Field id="email" name="email" :rules="validateEmail" type="email" />
      <ErrorMessage name="email" />

      <button type="submit">Submit</button>
    </Form>
  </div>
</template>

```