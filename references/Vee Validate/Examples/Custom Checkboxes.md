---
title: Custom Checkboxes
source: https://vee-validate.logaretm.com/v4/examples/custom-checkboxes/
author:
published:
created: 2025-10-21
description: Creating validatable checkbox inputs
tags:
  - clippings
updated: 2025-10-21T08:12
---
Checkboxes are more complex than regular text inputs, because there is always two states to keep track of which can be confusing at first. Mainly you should keep track of:

- Each individual input’s value
- Which inputs are current selected

To make this easier, remember that native checkboxes behave as a group while each input maintains it’s own value. Then a checkbox said to be checked when either:

- It’s value is the one currently selected
- It’s value is included in the ones selected

This is because of the nature of checkboxes behaving as **“multi-value”** form inputs, so you need to keep track of each input’s value and the currently selected one(s).

With all of that in mind, vee-validate offers simple abstractions for checkboxes. You can build your own checkboxes with vee-validate’s `useField` function which gives you the full capabilities of validation in a composable fashion.

Because `useField` isn’t aware of what kind of input will be composed with it, you will need to specify that the input is of type `checkbox` and pass a `checkedValue` as well which represents that single field’s value. By doing so, you gain access to `checked` prop which tells you if the checkbox should be selected.

```
jsimport { useField } from 'vee-validate';

export default {

  props: {

    // The group's value

    modelValue: {

      type: null,

    },

    // Field's own value

    value: {

      type: null,

    },

    name: {

      type: String,

    },

    rules: {

      type: String,

      default: undefined,

    },

  },

  setup(props) {

    // We pass a function to make sure the name stays reactive

    const { checked, handleChange } = useField(() => props.name, props.rules, {

      // 👇 These are important

      type: 'checkbox',

      checkedValue: props.value,

    });

    // select/unselect the input

    handleChange(props.value);

    return {

      checked, // readonly

      handleChange,

    };

  },

};
```

vee-validate handles some of the complexities of the checkbox inputs nature, by default if a checkbox field is registered it will be treated as a single input until another checkbox with the same name is registered. Then they will be treated as a group, and their values will affect the group value when they are selected or not.

Here is a live example of a custom checkbox input:

```vue
<script setup lang="ts">
import { Form, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import CustomCheckbox from './components/CustomCheckbox.vue';

const schema = yup.object({
  drinks: yup.array().of(yup.string().required()).required(),
});

function onSubmit(values) {
  alert(JSON.stringify(values, null, 2));
}
</script>

<template>
  <div>
    <h1>vee-validate custom checkboxes</h1>

    <Form @submit="onSubmit" :validation-schema="schema">
      <CustomCheckbox name="drinks" value="☕️" />
      <CustomCheckbox name="drinks" value="🍵" />
      <CustomCheckbox name="drinks" value="🥤" />

      <ErrorMessage name="drinks" />

      <button type="submit">Submit</button>
    </Form>
  </div>
</template>

```

tip

You can also specify a custom `uncheckedValue` which sets the input value to when it is unchecked.

```
jsconst { checked, handleChange } = useField('toa', undefined, {

  // Will make the checkbox set its value to true/false if it was checked or not

  type: 'checkbox',

  checkedValue: true,

  uncheckedValue: false,

});
```

[Edit This Page on GitHub](https://github.com/logaretm/vee-validate/edit/main/docs/src/pages/examples/custom-checkboxes.mdx)

[Sponsor](https://github.com/sponsors/logaretm)