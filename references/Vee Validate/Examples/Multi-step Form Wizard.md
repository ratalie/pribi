---
title: Multi-step Form Wizard
source: https://vee-validate.logaretm.com/v4/examples/multistep-form-wizard/
author:
published:
created: 2025-10-21
description: a multi-step form wizard
tags:
  - clippings
updated: 2025-10-21T08:13
---
These examples showcases a simple multi-step form (form wizard), with `next` and `previous` step navigation.

## Higher Order Components

This example uses the higher-order components only.

```vue
<script setup lang="ts">
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { ref, reactive, computed } from 'vue';

const currentStep = ref(0);

// Each step should have its own validation schema
const schemas = [
  yup.object({
    name: yup.string().required(),
    email: yup.string().required().email(),
  }),
  yup.object({
    password: yup.string().required().min(6),
    confirmPassword: yup
      .string()
      .required()
      .min(6)
      .oneOf([yup.ref('password')], 'Passwords must match'),
  }),
  yup.object({
    address: yup.string().required(),
    postalCode: yup
      .string()
      .required()
      .matches(/^[0-9]+$/, 'Must be numeric'),
  }),
  yup.object({
    terms: yup.bool().required().equals([true]),
  }),
];

const currentSchema = computed(() => {
  return schemas[currentStep.value];
});

function nextStep(values) {
  if (currentStep.value === 3) {
    console.log('Done: ', JSON.stringify(values, null, 2));
    return;
  }

  currentStep.value++;
}

function prevStep() {
  if (currentStep.value <= 0) {
    return;
  }

  currentStep.value--;
}
</script>

<template>
  <div>
    <h1>vee-validate form wizard</h1>
    <p>
      This example showcases a simple multi-step form (form wizard), basically
      we use the `handleSubmit` function before moving to the next step, which
      allows us to validate the current step without having to submit the form.

      <br />
      <br />

      For this use-case you should pass `keepValues` to the form to let
      vee-validate keep the values across steps.
    </p>

    <Form
      @submit="nextStep"
      :validation-schema="currentSchema"
      keep-values
      v-slot="{ handleSubmit, values }"
    >
      <template v-if="currentStep === 0">
        <label for="name">Name</label>
        <Field name="name" id="name" />
        <ErrorMessage name="name" />

        <label for="email">Email</label>
        <Field name="email" id="email" type="email" />
        <ErrorMessage name="email" />
      </template>

      <template v-if="currentStep === 1">
        <label for="password">Password</label>
        <Field name="password" type="password" id="password" />
        <ErrorMessage name="password" />

        <label for="confirmation">Confirm Password</label>
        <Field name="confirmPassword" type="password" id="confirmation" />
        <ErrorMessage name="confirmPassword" />
      </template>

      <template v-if="currentStep === 2">
        <label for="address">Address</label>
        <Field as="textarea" name="address" id="address" />
        <ErrorMessage name="address" />

        <label for="postalCode">Postal Code</label>
        <Field name="postalCode" id="postalCode" />
        <ErrorMessage name="postalCode" />
      </template>

      <template v-if="currentStep === 3">
        <label for="terms">Agree to terms and conditions</label>
        <Field name="terms" type="checkbox" id="terms" :value="true" />
        <ErrorMessage name="terms" />
      </template>

      <button v-if="currentStep !== 0" type="button" @click="prevStep">
        Previous
      </button>

      <button v-if="currentStep !== 3" type="submit">Next</button>

      <button v-if="currentStep === 3" type="submit">Finish</button>

      <pre>{{ values }}</pre>
    </Form>
  </div>
</template>

<style>
#app {
  font-family: Arial, Helvetica, sans-serif;
  max-width: 500px;
  padding-bottom: 100px;
}

input {
  display: block;
}

span {
  display: block;
  margin-bottom: 20px;
}

label {
  display: block;
  margin-top: 20px;
}

button {
  display: block;
  margin-top: 10px;
}

button[type='submit'] {
  margin-top: 10px;
}

form {
  padding: 20px;
  border: 1px solid black;
}

p {
  font-size: 14px;
}
</style>

```
## Composition API

This example uses the composition API to construct a system of `<FormStep>` and `<FormWizard>` components to make building form steps easier.

```vue
<script setup lang="ts">
import { Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import FormWizard from './components/FormWizard.vue';
import FormStep from './components/FormStep.vue';

// break down the validation steps into multiple schemas
const validationSchema = [
  yup.object({
    fullName: yup.string().required().label('Full Name'),
    email: yup.string().required().email().label('Email Address'),
  }),
  yup.object({
    password: yup.string().min(8).required(),
    confirmPass: yup
      .string()
      .required()
      .oneOf([yup.ref('password')], 'Passwords must match'),
  }),
  yup.object({
    favoriteDrink: yup
      .string()
      .required()
      .oneOf(['coffee', 'tea', 'soda'], 'Choose a drink'),
  }),
];

/**
 * Only Called when the last step is submitted
 */
function onSubmit(formData) {
  console.log(JSON.stringify(formData, null, 2));
}
</script>

<template>
  <div>
    <h1>Multi-step Form Wizard</h1>
    <p>
      This example uses a the composition API to create a multi-step form with
      next/previous controls and validation before moving to the next step.
      There are infinite ways you could implement this, this is just one of
      them. You could throw in a form generator to make this even easier.
    </p>

    <FormWizard :validation-schema="validationSchema" @submit="onSubmit">
      <FormStep>
        <Field name="fullName" type="text" placeholder="Type your Full name" />
        <ErrorMessage name="fullName" />

        <Field name="email" type="email" placeholder="Type your email" />
        <ErrorMessage name="email" />
      </FormStep>

      <FormStep>
        <Field
          name="password"
          type="password"
          placeholder="Type a strong one"
        />
        <ErrorMessage name="password" />

        <Field
          name="confirmPass"
          type="password"
          placeholder="Confirm your password"
        />
        <ErrorMessage name="confirmPass" />
      </FormStep>

      <FormStep>
        <Field name="favoriteDrink" as="select">
          <option>Select a drink</option>
          <option value="coffee">Coffee</option>
          <option value="tea">Tea</option>
          <option value="soda">Soda</option>
        </Field>
        <ErrorMessage name="favoriteDrink" />
      </FormStep>
    </FormWizard>
  </div>
</template>

<style>
input,
select {
  margin: 10px 0;
  display: block;
}
</style>

```