---
title: Validation Basics
source: https://vee-validate.logaretm.com/v4/tutorials/basics/
author:
published:
created: 2025-10-21
description: Build a newsletter form with vee-validate
tags:
  - clippings
updated: 2025-10-21T07:59
---
VeeValidate offers many ways to do form validation, this tutorial will teach you how to do basic form validation using the simplest approach.

## What are we building

In this tutorial, we will be building a “sign up newsletter” form where the user would have to fill a field to complete their sign-up.

## Prerequisites

This tutorial assumes you know:

- Modern JavaScript features like arrow functions and ES modules.
- Vue’s [SFC file syntax](https://v3.vuejs.org/guide/single-file-component.html#introduction).

## Setup

It is preferable to use a local development environment to follow along, make sure to have the following:

1. Prepare a Vue 3.x project using the [`vue-cli`](https://cli.vuejs.org/)
Detailed Steps

If not already prepared, install the New Vue CLI

```
shnpm install -g @vue/cli@next
```

Using the `vue-cli`, create a new project and choose Vue 3 template:

```
shvue create vee-validate-tutorial
```

1. Add `vee-validate` to your project

```
shyarn add vee-validate

# or

npm install vee-validate --save
```

1. Cleanup the contents of `App.vue`, it should look like the following:

```
vue<template>

  <div id="app"></div>

</template>

<script>

export default {};

</script>
```

And that’s it, now you have an empty Vue project and vee-validate installed.

## Building the Form

First, start by adding some markup, you can start by having a `form` wrapping a few `input` elements.

So far so good, try filling the `email` field with a dummy value like `hello`. Then click the submit button once and see what happens.

You will notice that the form submits and you should see `?email=` added in your URL in the address bar, it should have the same value that you entered in the `email` field.

This is the native HTML form submission behavior. Usually, in modern applications, you don’t want that and you prefer to handle submission with JavaScript.

The `novalidate` attribute on the `<form>` element is meant to disable the native HTML form validation, we will get to validating the form by the end of this tutorial.

Add a `submit` event handler that prevents the native form submission, we will use `onSubmit` function to handle our form submission.

Now type anything in the `email` field and click submit. You will notice a couple of things:

1. The word “Submitted” being logged to the console.
2. The value you entered wasn’t added to the address bar, this means you’ve prevented the default submission behavior.

So far so good, but the form isn’t that useful unless it takes the correct data from the user. So let’s add validation to the form.

## Adding Validation

VeeValidate exposes 2 components that you will be using regularly, the `<Field>` and `<Form>` are components that will help you validate your forms and inputs.

Import them and register them on the Vue component, then replace the following elements with the vee-validate component:

- Replace `<input>` with `<Field />` while keeping the same attributes.
- Replace `<form>` with `<Form />` but remove both the `.prevent` modifier and the `novalidate` attribute.

Change the `onSubmit` method so it receives an argument called `values` and logs it

```
jsexport default {

  components: {

    Form,

    Field,

  },

  methods: {

    onSubmit(values) {

      console.log(values);

    },

  },

};
```

Try typing anything into the `email` field and click submit. You will see form values being logged into the console with the value you entered, this means vee-validate extracted the form values for you and passed it to your `onSubmit` handler. Now all that remains is to add the validation rules.

There are multiple ways to define rules with VeeValidate, the most straightforward way is to use regular Vue methods.

Create a function called `validateEmail` that receives 1 argument called `value`.

It should look like this:

The `validateEmail` function makes sure the `email` field is both required and is a valid email.

Now you need to tell the `<Field name="email />` component to use that function as a validation rule.

You can do that by passing the `validateEmail` function to the `rules` prop on the `Field` component:

Try testing these scenarios:

1. Type a random non-email value like `example` into the `email` field and try clicking submit.
2. Type a valid email like `hello@example.com` into the `email` field and try clicking submit.

In the first case, you will notice that nothing was logged to the console, while in the second case you will see your form values being logged into the console the same as before.

This means validation is working and vee-validate is not executing your `onSubmit` handler until the `email` field validation passes.

The last step is to show error messages that you already return in the `validateEmail` so that your users have a better understanding of what is going on and why the form isn’t submitting.

To display the error message, you will use the `ErrorMessage` component.

```
jsimport { Field, Form, ErrorMessage } from 'vee-validate';

export default {

  components: {

    Field,

    Form,

    ErrorMessage,

  },

};
```

Add the `<ErrorMessage />` component to your template, passing a `name` prop that matches the `<Field />` name prop which is `"email"`.

If you try the form now without entering anything you will see the required error message appear. Try filling anything that’s not an email and notice the invalid email message appearing instead.

Now you have successfully created a simple form and implemented validation and submission.

You can check out the finished code in action:

There is a lot more you can do with vee-validate, there are other ways and features you can use to clean up your form validation logic. Here are a few things that you can do with vee-validate:

- Declare rules globally and use them in a Laravel-like syntax
- Using 3rd-party libraries like `yup` to validate
- Doing form-level validation using a validation schema
- Advanced rendering of your inputs and forms using scoped-slots
- Component-less validation with the composition API
- Generating localized messages

You can visit the [guide section](https://vee-validate.logaretm.com/v4/guide/overview) to begin learning more about vee-validate.

[Edit This Page on GitHub](https://github.com/logaretm/vee-validate/edit/main/docs/src/pages/tutorials/basics.mdx)

[Sponsor](https://github.com/sponsors/logaretm)