---
title: Typed Schemas
source: https://vee-validate.logaretm.com/v4/guide/composition-api/typed-schema/
author:
published:
created: 2025-10-21
description: Type-safe input and output types
tags:
  - clippings
updated: 2025-10-21T08:00
---
warn

This guide is aimed towards TypeScript usage with vee-validate’s composition API. If you are using the components API or JavaScript then there isn’t much to learn here.

## Input and Output types

Consider the following form:

```
tsimport { useForm } from 'vee-validate';

import { object, string } from 'yup';

const { values, handleSubmit } = useForm({

  validationSchema: object({

    email: string().required(),

    password: string().required(),

    name: string(),

  }),

});
```

When attempting to interact with the `values` you will notice that it is untyped. Meaning you don’t get any type hints or checks which makes it less safe to use.

```
ts// 💥 Blows up because \`email\` is undefined

values.email.endsWith('@gmail.com');
```

Providing an `initialValues` or an interface to `useForm` could help:

```
tsinterface MyForm {

  email?: string | null;

  password?: string | null;

}

const { values, handleSubmit } = useForm<MyForm>({

  validationSchema: object({

    email: string().required(),

    password: string().required(),

    name: string(),

  }),

});

// ❌ Type error, which means \`values\` is type-safe

values.email.endsWith('@gmail.com');
```

But then you will find another problem when using `handleSubmit`:

```
tshandleSubmit(values => {

  // Must be checked, this means submmited values are inaccurate

  if (values.email) {

    values.email.endsWith('@gmail.com');

  }

});
```

Even though you marked your field as `required`, it still uses the same type you provider earlier which will keep the `email` field as nullable. This is what we mean by the “dual nature” of form values.

Form values can exist in two types/versions:

- The **“input”** type which is the one the user is filling/interacting with, it is the one that captures the user input.
- The **“output”** type which is the one the user ends up submitting.

You can tell vee-validate about this information by using the typed schema resolvers available in companion packages.

## Yup

You can use yup as a typed schema with the `@vee-validate/yup` package:

```
sh# npm

npm install @vee-validate/yup

# yarn

yarn add @vee-validate/yup

# pnpm

pnpm add @vee-validate/yup
```

The `@vee-valdiate/yup` package exposes a `toTypedSchema` function that accepts any yup schema. Which then you can pass along to `validationSchema` option on `useForm`.

This makes the form values and submitted values typed automatically and caters for both input and output types of that schema.

```
tsimport { useForm } from 'vee-validate';

import { object, string } from 'yup';

import { toTypedSchema } from '@vee-validate/yup';

const { values, handleSubmit } = useForm({

  validationSchema: toTypedSchema(

    object({

      email: string().required(),

      password: string().required(),

      name: string(),

    }),

  ),

});

// ❌ Type error, which means \`values\` is type-safe

values.email.endsWith('@gmail.com');

handleSubmit(submitted => {

  // No errors, because email is required!

  submitted.email.endsWith('@gmail.com');

  // ❌ Type error, because \`name\` is not required so it could be undefined

  // Means that your fields are now type safe!

  submitted.name.length;

});
```

### Yup default values

You can also define default values on your schema directly and it will be picked up by the form:

```
tsimport { useForm } from 'vee-validate';

import { object, string } from 'yup';

import { toTypedSchema } from '@vee-validate/yup';

const { values, handleSubmit } = useForm({

  validationSchema: toTypedSchema(

    object({

      email: string().required().default('something@email.com'),

      password: string().required().default(''),

      name: string().default(''),

    }),

  ),

});
```

Your initial values will be using the schema defaults, and also the defaults will be used if the values submitted is missing these fields.

### Yup transforms

You can also define transforms to cast your fields before submission:

```
tsimport { useForm } from 'vee-validate';

import { object, number } from 'yup';

import { toTypedSchema } from '@vee-validate/yup';

const { values, handleSubmit } = useForm({

  validationSchema: toTypedSchema(

    object({

      age: number()

        .transform(val => Number(val))

        .required(),

    }),

  ),

});
```

But note that this does not change the input or output types of the casted fields. The cast will only occur when setting the initial value and when the values are submitted in the submission handler.

## Zod

Zod is an excellent library for value validation which mirrors static typing APIs.

In their own words it is a:

> TypeScript-first schema validation with static type inference

You can use zod as a typed schema with the `@vee-validate/zod` package:

```
sh# npm

npm install @vee-validate/zod

# yarn

yarn add @vee-validate/zod

# pnpm

pnpm add @vee-validate/zod
```

The `@vee-valdiate/zod` package exposes a `toTypedSchema` function that accepts any zod schema. Which then you can pass along to `validationSchema` option on `useForm`.

This makes the form values and submitted values typed automatically and caters for both input and output types of that schema.

```
tsimport { useForm } from 'vee-validate';

import { object, string } from 'zod';

import { toTypedSchema } from '@vee-validate/zod';

const { values, handleSubmit } = useForm({

  validationSchema: toTypedSchema(

    object({

      email: string().min(1, 'required'),

      password: string().min(1, 'required'),

      name: string().optional(),

    }),

  ),

});

// ❌ Type error, which means \`values\` is type-safe

values.email.endsWith('@gmail.com');

handleSubmit(submitted => {

  // No errors, because email is required!

  submitted.email.endsWith('@gmail.com');

  // ❌ Type error, because \`name\` is not required so it could be undefined

  // Means that your fields are now type safe!

  submitted.name.length;

});
```

refine/superRefine

There is a known issue with Zod’s `refine` and `superRefine` not executing whenever some object keys are missing or not filled which is common with forms. This is not an issue with vee-validate as it is a design choice in Zod at the moment. Refer to [this issue](https://github.com/logaretm/vee-validate/issues/4338) for explanations and further reading.

### Zod default values

You can also define default values on your zod schema directly and it will be picked up by the form:

```
tsimport { useForm } from 'vee-validate';

import { object, string } from 'zod';

import { toTypedSchema } from '@vee-validate/zod';

const { values, handleSubmit } = useForm({

  validationSchema: toTypedSchema(

    object({

      email: string().default('something@email.com'),

      password: string().default(''),

    }),

  ),

});
```

Your initial values will be using the schema defaults, and also the defaults will be used if the values submitted is missing these fields.

### Zod preprocess

You can also define preprocessors to cast your fields before submission:

```
tsimport { useForm } from 'vee-validate';

import { object, number, preprocess } from 'zod';

import { toTypedSchema } from '@vee-validate/zod';

const { values, handleSubmit } = useForm({

  validationSchema: toTypedSchema(

    object({

      age: preprocess(val => Number(val), number()),

    }),

  ),

});

// typed as \`unknown\` since the source value can be anything

values.age;

handleSubmit(submitted => {

  // will be typed as number because zod made sure it is!

  values.age;

});
```

## Valibot

[Valibot](https://valibot.dev/) is a schema library with bundle size, type safety and developer experience in mind. It is a great alternative to Yup and Zod if bundle size is a concern.

You can use valibot as a typed schema with the `@vee-validate/valibot` package:

```
sh# npm

npm install @vee-validate/valibot

# yarn

yarn add @vee-validate/valibot

# pnpm

pnpm add @vee-validate/valibot
```

The `@vee-valdiate/valibot` package exposes a `toTypedSchema` function that accepts any valibot schema. Which then you can pass along to `validationSchema` option on `useForm`.

This makes the form values and submitted values typed automatically and caters for both input and output types of that schema.

```
tsimport { useForm } from 'vee-validate';

import * as v from 'valibot';

import { toTypedSchema } from '@vee-validate/valibot';

const { values, handleSubmit } = useForm({

  validationSchema: toTypedSchema(

    v.object({

      name: v.pipe(v.string()),

      email: v.pipe(v.string() v.nonEmpty('required')),

      password: v.pipe(v.string(), v.minLength(6, 'Must be at least 6 characters')),

    }),

  ),

});

// ❌ Type error, which means \`values\` is type-safe

values.email.endsWith('@gmail.com');

handleSubmit(submitted => {

  // No errors, because email is required!

  submitted.email.endsWith('@gmail.com');

  // ❌ Type error, because \`name\` is not required so it could be undefined

  // Means that your fields are now type safe!

  submitted.name.length;

});
```

### Valibot default values

You can also define default values on your schema directly and it will be picked up by the form:

```
tsimport { useForm } from 'vee-validate';

import * as v from 'valibot';

import { toTypedSchema } from '@vee-validate/valibot';

const { values, handleSubmit } = useForm({

  validationSchema: toTypedSchema(

    v.object({

      email: v.optional(v.pipe(string(), v.nonEmpty('required')), 'something@email.com'),

      password: v.optional(v.pipe(v.string(), v.nonEmpty('required')), ''),

      name: v.optional(v.string(), ''),

    }),

  ),

});
```

Your initial values will be using the schema defaults, and also the defaults will be used if the values submitted is missing these fields.

### Valibot transforms

You can also define transforms to cast your fields before submission:

```
tsimport { useForm } from 'vee-validate';

import * as v from 'valibot';

import { toTypedSchema } from '@vee-validate/valibot';

const { values, handleSubmit } = useForm({

  validationSchema: toTypedSchema(

    object({

      age: v.pipe(

        v.unknown(),

        v.transform(v => Number(v)),

      ),

    }),

  ),

});
```

But note that this does not change the input or output types of the casted fields. The cast will only occur when setting the initial value and when the values are submitted in the submission handler.

## Next Step

This next guide covers the weird parts and offers recommendations into how to use vee-validate's composition API effectively.

[

Caveats and best practices Things to keep in mind when using the composition API and some recommendations to follow.

](https://vee-validate.logaretm.com/v4/guide/composition-api/caveats/)

[Edit This Page on GitHub](https://github.com/logaretm/vee-validate/edit/main/docs/src/pages/guide/composition-api/typed-schema.mdx)

[Sponsor](https://github.com/sponsors/logaretm)