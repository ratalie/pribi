---
title: Dynamic validation triggers
source: https://vee-validate.logaretm.com/v4/examples/dynamic-validation-triggers/
author:
published:
created: 2025-10-21
description: Dynamic interaction for your inputs
tags:
  - clippings
updated: 2025-10-21T08:12
---
In previous versions of vee-validate you could configure what events trigger the validation based on the field state. This feature was called “interaction modes”. In vee-validate v4 this feature was removed because it is now possible to implement it with the composition API.

This example should help you figure out how to migrate this feature from older vee-validate versions.

```vue
<script setup lang="ts">
import { Form } from 'vee-validate';
import * as yup from 'yup';
import CustomField from './components/CustomField.vue';

function onSubmit(values) {
  alert(JSON.stringify(values, null, 2));
}

const schema = yup.object({
  email: yup.string().email().required(),
});
</script>

<template>
  <div>
    <h1>vee-validate Dynamic validation Triggers</h1>
    <p>
      This input can customize the validation triggers using "interaction
      modes". Try passing either `passive`, `aggressive`, `lazy` or `eager` and
      see how it changes the validation behavior.
    </p>

    <Form @submit="onSubmit" :validation-schema="schema">
      <label for="email">Email</label>
      <CustomField name="email" type="email" mode="aggressive" />

      <button type="submit">Submit</button>
    </Form>
  </div>
</template>

<style>
#app {
  font-family: Arial, Helvetica, sans-serif;
  max-width: 500px;
}

input {
  display: block;
  margin-bottom: 20px;
}

button {
  display: block;
}

form {
  padding: 20px;
  border: 1px solid black;
}
</style>

```