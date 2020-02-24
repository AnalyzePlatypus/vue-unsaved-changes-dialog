# Vue Unsaved Changes Dialog

A Vue component inspired by the new skeumorphic segmented control in iOS 13.

[Live demo › ](https://vue-unsaved-changes-dialog.netlify.com)

* Darkens background
* Displays a responsive popup with "Cancel", "Discard", and "Save"
* Smoothly animates in and out
* On desktop, popup appears directly under the mouse cursor
* Popup intelligently avoids the window edges and responds to window resizing
* On mobile, popup is rendered as full-screen modal 
* Keyboard navigable


![Demo GIF](/demo.gif)

## Install (not live yet)

```bash
npm i vue-unsaved-changes-dialog
```

## Usage

```html
<VueUnsavedChangesDialog
  :show="shouldShowDialog"
  @cancel="cancelFn"
  @discard="discardFn"
  @save="saveFn"/>
```

## Live Development

You'll need [NPM](https://www.npmjs.com/get-npm) and the [Vue CLI](https://cli.vuejs.org/guide/installation.html).

```bash
npm install 
npm run serve
```

## Building

You'll need to install [Rollup.js](https://rollupjs.org/guide/en/) to run the build script.
Install it with `npm install --g rollup` 

```
npm run build
```

Running the build script generate `main` (`.ssr.js`), `module` (`.esm.js`), and `unpkg` (`.min.js`) versions in the `dist` directory.

## Thank you

* Inspired by the Squarespace unsaved changes dialog 

* The component development template I used is [vue-sfc-rollup](https://github.com/team-innovation/vue-sfc-rollup) by [Team Innovation](https://github.com/team-innovation)


