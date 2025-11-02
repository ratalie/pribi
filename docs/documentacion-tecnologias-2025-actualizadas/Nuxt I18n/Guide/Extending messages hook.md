---
title: Extending messages hook
source: https://i18n.nuxtjs.org/docs/guide/extend-messages
author:
  - "[[@nuxtjs/i18n]]"
published:
created: 2025-10-15
description: Nuxt hooks to extend i18n messages in your project.
tags:
  - clippings
updated: 2025-10-15T22:01
---
Nuxt hooks to extend i18n messages in your project.

If you're a **module author** and want that module to provide extra messages for your project, you can merge them into the normally loaded messages by using the `'i18n:registerModule'` hook.

This is particularly useful if your module uses translated content and you want to offer nice default translations.

In your module's setup file listen to the Nuxt `'i18n:registerModule'` hook and register your i18n configuration, this is similar to how [lazy-load translations](https://i18n.nuxtjs.org/docs/guide/lazy-load-translations) are configured.

Translations added this way will be loaded after those added in your project, and before extended layers.

Example:

Now the project has access to new messages and can use them through `$t('my-module-example.hello')`.

Because module's messages are merged with the project's ones, it's safer to prefix them. Main project messages **will always override** messages provided by modules.[Per-Component Translations](https://i18n.nuxtjs.org/docs/guide/per-component-translations)

[

Inline your translation messages within your components.

](https://i18n.nuxtjs.org/docs/guide/per-component-translations)[

Extending pages

Adding localized pages from a module.

](https://i18n.nuxtjs.org/docs/guide/extend-pages)