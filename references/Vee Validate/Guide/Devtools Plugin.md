---
title: Devtools Plugin
source: https://vee-validate.logaretm.com/v4/guide/devtools/
author:
published:
created: 2025-10-21
description: Using the vee-validate Vue.js devtools plugin
tags:
  - clippings
updated: 2025-10-21T08:00
---
## Devtools Plugin v4.5

vee-validate ships with a Vue.js devtools plugin that allows you to inspect your forms. The terms “devtools plugin” or “plugin” in this page will refer to vee-validate’s devtools plugin from now on.

The devtools plugin is useful for debugging and inspecting your forms. A common situation is not having any clues on why a form isn’t submitting, the devtools plugin exposes to you all of the validation state giving you insight for your forms behavior.

Since vee-validate doesn’t require any app configuration, the devtools plugin is auto installed when you use `useField` or `useForm` or their component counterpart `<Field />` and `<Form />`.

warn

Note that the plugin won’t be installed in the following cases:

- You are using the umd builds via CDN
- Your `process.env.NODE_ENV` is set to `production` or `test`

That means the plugin is only available to the workflows that employ either webpack or vite where `process.env.NODE_ENV` is available.

## The Inspector

The devtools plugin adds a new “vee-validate” inspector that allows you to view your form state, at the moment all the properties are read only.

To use the vee-validate inspector, switch from the `components` inspector to the `vee-validate` inspector:

<video xmlns="http://www.w3.org/1999/xhtml" src="/v4/video/inspector.mp4"></video>

Form Name

When working with multiple forms, you can distinguish between them by their name. The name of the form can be set using the `name` prop on the `<Form />` component or the `useForm` composable.

## Disabling the plugin

If the plugin is causing you issues, you can disable it explicitly from the vue-devtools plugin page.

Also please don’t forget to report the issue [here](https://github.com/logaretm/vee-validate/issues/new?assignees=&labels=&template=bug_report.yaml).

This short video shows how to disable the vee-validate devtools plugin:

<video xmlns="http://www.w3.org/1999/xhtml" src="/v4/video/disable-plugin.mp4"></video>

## Next Step

[

Testing Testing form validation in your apps

](https://vee-validate.logaretm.com/v4/guide/testing/)

[Edit This Page on GitHub](https://github.com/logaretm/vee-validate/edit/main/docs/src/pages/guide/devtools.mdx)

[Sponsor](https://github.com/sponsors/logaretm)