---
title: Composition Helpers
source: https://vee-validate.logaretm.com/v4/api/composition-helpers/
author:
published:
created: 2025-10-21
description: Various composable functions to compose validation logic into your components
tags:
  - clippings
updated: 2025-10-21T08:20
---
The composition helpers are various functions that you can use to craft specialized form components, like a submission indicator component or a custom error messages component.

These functions expose validation state to child components, most of these functions expose 2 variants of each state. On a form level and a field level.

## API Reference

tip

All of the following code snippets assume you are using them inside a `setup` function.

#### useFieldError(field?: string): ComputedRef<string | undefined>

Returns a computed ref to a single field’s error message, returns `undefined` if no errors were found for that field or if the field does not exist.

```
jsimport { useFieldError } from 'vee-validate';

const message = useFieldError('fieldName');

message.value; // string or \`undefined\`
```

You can also use it in a child component that has a parent that used `useField`, The `useFieldError` will automatically pick up the field and produce its error messages.

```
jsimport { useFieldError } from 'vee-validate';

// Will look for the first parent that used \`useField\`

const message = useFieldError();

message.value;
```

#### useFormErrors(): ComputedRef<Record<string, string | undefined>>

Returns a computed ref to the error bag of the entire form, fields with no errors will not be included in the error bag object.

```
jsimport { useFormErrors } from 'vee-validate';

const errors = useFormErrors();

message.value; // {}
```

#### useIsFieldDirty(field?: string): ComputedRef<boolean>

Returns a computed ref to the specified field’s `dirty` meta state.

```
jsimport { useIsFieldDirty } from 'vee-validate';

const isDirty = useIsFieldDirty();

isDirty.value; // true or false
```

You can also use it in a child component that has a parent that used `useField`, The `useIsFieldDirty` will automatically pick up the field and produce its meta `dirty` value

```
jsimport { useIsFieldDirty } from 'vee-validate';

// Will look for the first parent that used \`useField\`

const isDirty = useIsFieldDirty();
```

#### useIsFormDirty(): ComputedRef<boolean>

Returns a computed ref to the context form `dirty` meta state.

```
jsimport { useIsFormDirty } from 'vee-validate';

const isDirty = useIsFormDirty();

isDirty.value; // true or false
```

#### useIsFieldTouched(field?: string): ComputedRef<boolean>

Returns a computed ref to the specified field’s `touched` meta state.

```
jsimport { useIsFieldTouched } from 'vee-validate';

const isTouched = useIsFieldTouched('fieldName');

isTouched.value; // true or false
```

You can also use it in a child component that has a parent that used `useField`, The `useIsFieldTouched` will automatically pick up the field and produce its meta `touched` value

```
jsimport { useIsFieldTouched } from 'vee-validate';

// Will look for the first parent that used \`useField\`

const isTouched = useIsFieldTouched();
```

#### useIsFormTouched(): ComputedRef<boolean>

Returns a computed ref to the context form `touched` meta state.

```
jsimport { useIsFormTouched } from 'vee-validate';

const isTouched = useIsFormTouched();

isTouched.value; // true or false
```

#### useIsFieldValid(field?: string): ComputedRef<boolean>

Returns a computed ref to the specified field’s `valid` meta state, inner `value` will be `true` if the field has no errors, and `false` if it has any error message.

```
jsimport { useIsFieldValid } from 'vee-validate';

const isValid = useIsFieldValid('fieldName');

isValid.value; // true or false
```

You can also use it in a child component that has a parent that used `useField`, The `useIsFieldValid` will automatically pick up the field and produce its meta `valid` value

```
jsimport { useIsFieldValid } from 'vee-validate';

// Will look for the first parent that used \`useField\`

const isValid = useIsFieldValid();
```

warn

Creating disabled buttons based on the `valid` attribute isn’t accurate, because if the field hasn’t been validated yet it, the `valid` property will be `true` which isn’t accurate. You should combine `valid` checks with `dirty` state to get the most accuracy.

#### useIsFormValid(): ComputedRef<boolean>

Returns a computed ref to the context form `valid` meta state.

```
jsimport { useIsFormValid } from 'vee-validate';

const isValid = useIsFormValid();

isValid.value; // true or false
```

warn

Creating disabled buttons based on the `valid` attribute isn’t accurate, because if the form hasn’t been validated yet it, the `valid` property will be `true` which isn’t accurate. You should combine `valid` checks with `dirty` state to get the most accuracy.

#### useValidateField(field?: string): () => Promise<ValidationResult>

Returns a function that validates the field and returns a validation result object containing any errors, if the `errors` field is empty then it means the field is valid. If a field doesn’t not exist it will return an empty `errors` field with a warning.

```
jsimport { useValidateField } from 'vee-validate';

const validate = useValidateField('fieldName');

await validate();
```

You can also use it in a child component that has a parent that used `useField`, The `useValidateField` will automatically pick up the field and will return the function that validates it.

```
jsimport { useValidateField } from 'vee-validate';

// Will look for the first parent that used \`useField\`

const validate = useValidateField();
```

#### useValidateForm(): () => Promise<FormValidationResult>

Returns a function that validates the form and returns a `Form`.

```
jsimport { useValidateForm } from 'vee-validate';

const validate = useValidateForm();

await validate();
```

#### useIsSubmitting(): ComputedRef<boolean>

Returns a computed ref to the form’s `isSubmitting` state.

```
jsimport { useIsSubmitting } from 'vee-validate';

const isSubmitting = useIsSubmitting();

isSubmitting.value; // true or false
```

#### useIsValidating(): ComputedRef<boolean>

Returns a computed ref to the form’s `isValidating` state.

```
jsimport { useIsValidating } from 'vee-validate';

const isValidating = useIsValidating();

isValidating.value; // true or false
```

#### useSubmitCount(): ComputedRef<number>

Returns a computed ref to the form’s `submitCount` state.

```
jsimport { useSubmitCount } from 'vee-validate';

const count = useSubmitCount();

count.value;
```

#### useResetForm(): () => void

Returns a function that you can use to reset the form

```
jsimport { useResetForm } from 'vee-validate';

const resetForm = useResetForm();

resetForm(); // resets the form
```

#### useSubmitForm(cb: SubmissionHandler): () => void

Returns a function that you can use to validate the form and submit if it turns out valid. It does this by accepting a function that should handle the submission logic like sending data to your API. That function will not run unless the form is valid and it receives all the fields current values packed in an object.

```
jsimport { useSubmitForm } from 'vee-validate';

const submitForm = useSubmitForm((values, actions) => {

  // Send data to your api ...

  alert(JSON.stringify(values, null, 2));

  // You can perform any of the form actions using the actions object

  // set a single field value

  actions.setFieldValue('field', 'hello');

  // set multiple fields values

  actions.setValues({ email: 'value', password: 'hi' });

  // set a single field error

  actions.setFieldError('field', 'this field is bad');

  // set multiple fields errors

  actions.setErrors({ email: 'bad email', password: 'bad password' });

  // reset the form

  actions.resetForm();

});
```

Virtual Forms

While it is recommended to use actual `form` elements for accessibility, you could still use `useSubmitForm` to submit any group of data which may or may not be involved with a `form` element.

#### useFieldValue(field?: string): ComputedRef<any>

Returns a computed ref to the specified field’s current value.

```
jsimport { useFieldValue } from 'vee-validate';

const currentValue = useFieldValue('fieldName');

currentValue.value;
```

You can also use it in a child component that has a parent that used `useField`, The `useFieldValue` will automatically pick up the field and produce its current value.

```
jsimport { useFieldValue } from 'vee-validate';

// Will look for the first parent that used \`useField\`

const currentValue = useFieldValue();
```

#### useFormValues(): ComputedRef<Record<string, any>>

Returns a computed ref to the context form current values.

```
jsimport { useFormValues } from 'vee-validate';

const values = useFormValues();

values.value;
```

[Edit This Page on GitHub](https://github.com/logaretm/vee-validate/edit/main/docs/src/pages/api/composition-helpers.mdx)

[Sponsor](https://github.com/sponsors/logaretm)