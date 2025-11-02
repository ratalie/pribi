---
title: FieldArray
source: https://vee-validate.logaretm.com/v4/api/field-array/
author:
published:
created: 2025-10-21
description: API reference for the Field Array component
tags:
  - clippings
updated: 2025-10-21T08:19
---
## FieldArray v4.5

Form Context

The `<FieldArray />` component requires being used inside a `Form` component or a `useForm` to be called at its parent tree.

The `<FieldArray />` component is used to manage repeatable array fields. It is a renderless component, meaning it doesn’t render anything of its own.

```
vue<template>

  <Form @submit="onSubmit" :initial-values="initialValues">

    <FieldArray name="links" v-slot="{ fields, push, remove }">

      <div v-for="(field, idx) in fields" :key="field.key">

        <Field :name="\`links[${idx}].url\`" type="url" />

        <button type="button" @click="remove(idx)">Remove</button>

      </div>

      <button type="button" @click="push({ id: Date.now(), name: '', url: '' })">Add</button>

    </FieldArray>

    <button>Submit</button>

  </Form>

</template>

<script setup>

// you can set initial values for those array fields

const initialValues = {

  links: [{ id: 1, url: 'https://github.com/logaretm' }],

};

function onSubmit(values) {

  alert(JSON.stringify(values, null, 2));

}

</script>
```

## API Reference

### Props

| Prop | Type | Required/Default | Description |
| --- | --- | --- | --- |
| `arrayPath` | `string` | Yes | The form array path you wish to manage |

### Slots

#### default

The default slot gives you access to the following props:

#### fields: FieldArrayEntry<TValue>

This is a **read-only** version of your array items, wrapped inside a `FieldArrayEntry` object which has the following interface:

```
tsinterface FieldEntry<TValue = unknown> {

  // The actual value of the item, this is what exists in the form values

  value: TValue;

  // a value you can use as a key for iteration, automatically generated.

  key: string | number;

  // true if this is the first array item

  isFirst: boolean;

  // true if this is the last array item

  isLast: boolean;

}
```

#### push(item: any)

Adds an item to the end of the array.

#### prepend(item: any)

Adds an item to the start of the array.

#### remove(idx: number)

Removes the item at the specified index from the array if it exists.

#### swap(idxA: number, idxB: number)

Swaps the items at the given indexes with each other. Both indexes must exist in the array or it won’t have an effect.

#### insert(idx: number, item: any)

Adds an item at the specified index. If the specified index will place the item out of bounds (i.e: larger than length) the operation will be ignored, you still can add items as the last item of the array.

#### update(idx: number, value: any)

Updates the value at the specified index, note that it doesn’t merge the values if they are objects. If the specified index is outside the array boundary the operation will be ignored.

#### replace(items: any\[\])

Replaces the entire array of fields.

#### move(oldIdx: number, newIdx: number)

Moves an array item to a different position within the array. If one of the indices is outside of the array boundaries the operation will be ignored.

[Edit This Page on GitHub](https://github.com/logaretm/vee-validate/edit/main/docs/src/pages/api/field-array.mdx)

[Sponsor](https://github.com/sponsors/logaretm)