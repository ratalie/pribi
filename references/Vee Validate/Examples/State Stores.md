---
title: State Stores
source: https://vee-validate.logaretm.com/v4/examples/using-stores/
author:
published:
created: 2025-10-21
description: using vee-validate with state stores
tags:
  - clippings
updated: 2025-10-21T08:16
---
## Stores

If you want to integrate vee-validate with state management solutions you can do that with the composition API.

## Pinia

[Pinia](https://pinia.esm.dev/) is a data store for Vue.js and it is the recommended solution to your Vue.js state management.

The example integrates a form state into the store by utilizing a setup function when defining a store. This makes vee-validate act as a state provider for the form where the form values become your store state and submit function becomes your store action.

warn

Using `useForm` inside Pinia stores may cause unwanted behavior as lifecycle hooks only execute against the component that first initialized the store.

```vue
<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useSignupStore } from './stores';

const store = useSignupStore();

const { name, nameProps, email, emailProps, password, passwordProps, errors } =
  storeToRefs(store);
</script>

<template>
  <form @submit="store.signup" novalidate>
    <div class="field">
      <input placeholder="Name" v-model="name" v-bind="nameProps" />
      <span>{{ errors.name }}</span>
    </div>

    <div class="field">
      <input
        type="email"
        v-model="email"
        placeholder="Email"
        v-bind="emailProps"
      />
      <span>{{ errors.email }}</span>
    </div>

    <div class="field">
      <input
        type="password"
        v-model="password"
        placeholder="Password"
        v-bind="passwordProps"
      />
      <span>{{ errors.password }}</span>
    </div>

    <button type="submit">Submit</button>
  </form>
</template>

```

#### Store

```ts
import { defineStore } from 'pinia';
import { useForm } from 'vee-validate';
import * as Yup from 'yup';

const schema = Yup.object({
  name: Yup.string().required(),
  email: Yup.string().email().required(),
  password: Yup.string().min(6).required(),
});

export const useSignupStore = defineStore('signup', () => {
  const { errors, defineField, handleSubmit } = useForm({
    validationSchema: schema,
  });

  const [name, nameProps] = defineField('name');
  const [email, emailProps] = defineField('email');
  const [password, passwordProps] = defineField('password');

  const signup = handleSubmit((values) => {
    // send values to API
    console.log('Submit', JSON.stringify(values, null, 2));
  });

  return {
    errors,
    name,
    nameProps,
    email,
    emailProps,
    password,
    passwordProps,
    signup,
  };
});

```