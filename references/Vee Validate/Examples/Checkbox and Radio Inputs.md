---
title: Checkbox and Radio Inputs
source: https://vee-validate.logaretm.com/v4/examples/checkboxes-and-radio/
author:
published:
created: 2025-10-21
description: Validating checkboxes and Radio inputs
tags:
  - clippings
updated: 2025-10-21T08:09
---

### Checkbox and Radio Inputs

The documentation has so far avoided using type="radio" and type="checkbox" inputs because of their complex nature, however vee-validate supports both HTML checkboxes and radio inputs as well as your custom components that act as such (with caveats).

The only requirements are that the fields:

- Must be inside a Form component or a derivative (using useForm)
- Must Have the same name prop
- Should have a type attribute

### Validating Radio Inputs

vee-validate handles radio input groups as long as they have the type="radio" and the same name prop value. The selected value will be present in the values object.

```vue
<script setup lang="ts">
import { Form, Field, ErrorMessage } from 'vee-validate';

const schema = {
  drink: (value) => {
    if (value) {
      return true;
    }

    return 'You must choose a drink';
  },
};

function onSubmit(values) {
  console.log(JSON.stringify(values, null, 2));
}
</script>

<template>
  <div id="app">
    <Form :validation-schema="schema" @submit="onSubmit" v-slot="{ values }">
      <Field name="drink" type="radio" value="" /> None
      <Field name="drink" type="radio" value="Tea" /> Tea
      <Field name="drink" type="radio" value="Coffee" /> Coffee

      <ErrorMessage name="drink" />

      <button>Submit</button>

      <p>Values</p>
      <pre>{{ values }}</pre>
    </Form>
  </div>
</template>

```

### Validating Checkbox Inputs

vee-validate handles checkboxes as long as they have the type="checkbox" prop and the same name prop value. The selected values will be collected in an array similar to what v-model does.

```vue
<script setup lang="ts">
import { Form, Field, ErrorMessage } from 'vee-validate';

const schema = {
  drink: (value) => {
    if (value && value.length) {
      return true;
    }

    return 'You must choose a drink';
  },
};

function onSubmit(values) {
  console.log(JSON.stringify(values, null, 2));
}
</script>

<template>
  <div id="app">
    <Form :validation-schema="schema" @submit="onSubmit" v-slot="{ values }">
      <Field name="drink" type="checkbox" value="Water" /> Water
      <Field name="drink" type="checkbox" value="Tea" /> Tea
      <Field name="drink" type="checkbox" value="Coffee" /> Coffee

      <ErrorMessage name="drink" />

      <button>Submit</button>

      <p>Values</p>
      <pre>{{ values }}</pre>
    </Form>
  </div>
</template>


```

If there is only one checkbox then its value will be directly assigned in the values object without binding it in an array.


