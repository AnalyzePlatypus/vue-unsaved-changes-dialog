# Vue Unsaved Changes Dialog

A beautiful unsaved changes dialog, inspired by a component from the Squarespace admin.

[Live demo › ](https://vue-unsaved-changes-dialog.netlify.com)

* Save, Discard, and Cancel buttons
* On desktop, popup appears precisely underneath the mouse cursor
* Smoothly animates in and out
* Popup intelligently avoids the window edges and responds to window resizing
* Full responsive: renders as in full-screen on mobile
* Keyboard navigable/accessible

![Demo GIF](/demo.gif)

### More goodies

* Includes buttery animations for both desktop and mobile
* Mouse listener is throttled to avoid performance issues (bundles `lodash.throttle`, an extra 2KB)
* All listeners are deactivated when component is torn down
* Darkens background
* Clicking the background dismisses the dialog (same as cancel button)
* Bundles desktop, mobile, popup positioning logic, and all styles and animations in 14KB

## Install

```bash
npm i vue-unsaved-changes-dialog
```

## Usage

```html
<VueUnsavedChangesDialog
  :title="Unsaved Changes"
  :subtitle="['You have unsaved changes', 'Would you like to save or discard them?']"
  :show="shouldShowDialog"
  @cancel="cancelFn"
  @discard="discardFn"
  @save="saveFn"/>
```

## Gallery

### Still
<div style="display:flex;">
  <div>
    <h4>Desktop</h4>
    <image src="desktop.png">
  </div>
  <div>
    <h4>Mobile</h4>
    <image src="mobile.png">
  </div>
</div>




### Responsive
![Responsive demo](/responsive.gif)

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


