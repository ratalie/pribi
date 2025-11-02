---
title: VeeValidate - shadcn/vue
source: https://www.shadcn-vue.com/docs/components/form.html
author:
published:
created: 2025-10-13
description: Building forms with VeeValidate and Zod.
tags:
  - clippings
updated: 2025-10-13T14:26
---
## VeeValidate

Building forms with VeeValidate and Zod.

[API Reference](https://vee-validate.logaretm.com/v4/guide/overview/)

Forms are tricky. They are one of the most common things you'll build in a web application, but also one of the most complex.

Well-designed HTML forms are:

- Well-structured and semantically correct.
- Easy to use and navigate (keyboard).
- Accessible with ARIA attributes and proper labels.
- Has support for client and server side validation.
- Well-styled and consistent with the rest of the application.

In this guide, we will take a look at building forms with [`vee-validate`](https://vee-validate.logaretm.com/v4/) and [`zod`](https://zod.dev/). We're going to use a `<FormField>` component to compose accessible forms using Reka UI components.

## Features

The `<Form />` component is a wrapper around the `vee-validate` library. It provides a few things:

- Composable components for building forms.
- A `<FormField />` component for building controlled form fields.
- Form validation using `zod`.
- Applies the correct `aria` attributes to form fields based on states, handle unique IDs
- Built to work with all Reka UI components.
- Bring your own schema library. We use `zod` but you can use any other supported schema validation you want, like [`yup`](https://github.com/jquense/yup) or [`valibot`](https://valibot.dev/).
- **You have full control over the markup and styling.**

[`vee-validate`](https://vee-validate.logaretm.com/v4/) makes use of two flavors to add validation to your forms.

- Composition API
- Higher-order components (HOC)

## Anatomy

## Example

## Installation

## Usage

### Create a form schema

Define the shape of your form using a Zod schema. You can read more about using Zod in the [Zod documentation](https://zod.dev/).

Use `@vee-validate/zod` to integrate Zod schema validation with `vee-validate`

`toTypedSchema` also makes the form values and submitted values typed automatically and caters for both input and output types of that schema.

### Define a form

Use the `useForm` composable from `vee-validate` or use `<Form />` component to create a form.

### Build your form

Based on last step we can either use `<Form />` component or `useForm` composable `useForm` is recommended because values are typed automatically

```
vue<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const formSchema = toTypedSchema(z.object({
  username: z.string().min(2).max(50),
}))

const form = useForm({
  validationSchema: formSchema,
})

const onSubmit = form.handleSubmit((values) => {
  console.log('Form submitted!', values)
})
</script>

<template>
  <form @submit="onSubmit">
    <FormField v-slot="{ componentField }" name="username">
      <FormItem>
        <FormLabel>Username</FormLabel>
        <FormControl>
          <Input type="text" placeholder="shadcn" v-bind="componentField" />
        </FormControl>
        <FormDescription>
          This is your public display name.
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>
    <Button type="submit">
      Submit
    </Button>
  </form>
</template>
```

### Done

That's it. You now have a fully accessible form that is type-safe with client-side validation.

## Examples

See the following links for more examples on how to use the `vee-validate` features with other components:

- [Checkbox](https://www.shadcn-vue.com/docs/components/checkbox.html#form)
- [Date Picker](https://www.shadcn-vue.com/docs/components/date-picker.html#form)
- [Input](https://www.shadcn-vue.com/docs/components/input.html#form)
- [Radio Group](https://www.shadcn-vue.com/docs/components/radio-group.html#form)
- [Select](https://www.shadcn-vue.com/docs/components/select.html#form)
- [Slider](https://www.shadcn-vue.com/docs/components/slider.html#form)
- [Switch](https://www.shadcn-vue.com/docs/components/switch.html#form)
- [Textarea](https://www.shadcn-vue.com/docs/components/textarea.html#form)
- [Combobox](https://www.shadcn-vue.com/docs/components/combobox.html#form)

## Extras

This example shows how to add motion to your forms with [Formkit AutoAnimate](https://auto-animate.formkit.com/)

[Edit this page on GitHub](https://github.com/unovue/shadcn-vue/tree/dev/apps/www/src/content/docs/components/form.md)