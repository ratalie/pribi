---
title: Layers
source: https://i18n.nuxtjs.org/docs/guide/layers
author:
  - "[[@nuxtjs/i18n]]"
published:
created: 2025-10-15
description: Using layers to extends projects with Nuxt i18n.
tags:
  - clippings
updated: 2025-10-15T22:01
---
Using layers to extends projects with Nuxt i18n.

Nuxt i18n module supports layers and will automatically combine i18n configuration of all extended layers. [Read more about layers here](https://nuxt.com/docs/getting-started/layers)

## Merging strategy

As described in the [Nuxt layer authoring guide](https://nuxt.com/docs/guide/going-further/layers#multi-layer-support-for-nuxt-modules)

> - Earlier items in the `_layers` array have higher priority and override later ones
> - The user's project is the first item in the `_layers` array

Mixing locale configuration such as lazy loading objects and strings may not work as expected, Nuxt i18n will attempt to merge layers as best it can. Consistency of i18n configuration between layers will be most effective.

## Pages & Routing

Pages in the `pages` directory from extended layers will automatically be merged and have i18n support as if they were part of your project.

Page routes defined in `i18n.pages` in each layer configuration will be merged as well.

## Locales

A project extending a layer set up with the Nuxt i18n module needs no additional set up as shown in this example:

The project is able to use i18n functionality and the configured locales would be loaded provided by the extended layer.

### Merging locales

Locales provided by a project will be merged with those provided by extended layers, this can be done as follows:

This example would result in the project supporting two locales (`'en'`, `'nl'`) and would add the additional messages added for the `'en'` locale.

The above will result in the following

```
{

  // earlier layers take priority

  "title": "foo",

  "description": "bar"

}
```

## VueI18n options

Options defined in VueI18n configuration files within layers are merged and override each other according to their layers priority.[Extending pages](https://i18n.nuxtjs.org/docs/guide/extend-pages)

[

Adding localized pages from a module.

](https://i18n.nuxtjs.org/docs/guide/extend-pages)[

Server-Side Translations

Translate on the server-side and return it as a response.

](https://i18n.nuxtjs.org/docs/guide/server-side-translations)