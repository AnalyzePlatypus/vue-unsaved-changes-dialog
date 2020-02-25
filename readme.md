# Vue Unsaved Changes Dialog

A beautiful unsaved changes dialog, inspired by a component from the Squarespace admin.

[Live demo › ](https://vue-unsaved-changes-dialog.netlify.com)

* Save, Discard, and Cancel buttons
* On desktop, popup appears precisely underneath the mouse cursor
* Smoothly animates in and out
* Popup intelligently avoids the window edges and responds to window resizing
* Full responsive: renders as in full-screen on mobile
* Keyboard navigable/accessible
* All text is replaceable

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

<button @click="attemptToGoBack">Back</button>

<UnsavedChangesDialog
  :title="Unsaved Changes"
  :subtitle="['You have unsaved changes', 'Would you like to save or discard them?']"
  :show="shouldShowDialog"
  @cancel="closePopup"
  @discard="discard"
  @save="save"/>
```

Detailed use case:

```javascript

import UnsavedChangesDialog from 'vue-unsaved-changes-dialog';

export default {
  name: 'App',
  data() {
    return {
      shouldShowDialog: false,
    }
  },
  methods: {
    attemptToGoBack() {
      this.hasUnsavedChanges ? 
        this.showPopup() :
        this.exit();
    },
    exit() {
      this.closePopup();
      // and leave the view
    },
    showPopup() {
      this.shouldShowDialog = true;
    },
    closePopup() {
      this.shouldShowDialog = false;
    },
    discard() {
      this.discardEdits();
      this.exit();
    },
    discardEdits() {
      // your code here
    },
    async save() {
      try {
        await this.saveChangesToServer();
        this.exit();
      } catch(e) {
        console.error(e);
      }
    },
    async saveChangesToServer() {
      // your code here
    }
  },
  computed: {
    hasUnsavedChanges() {
      // check for unsaved changes
    }
  },
  components: {
    UnsavedChangesDialog
  }
}
```

## Customizing

### Text

The title and body text can be customized with props:

```html
<UnsavedChangesDialog
  :title="Unsaved Changes"
  :subtitle="['You have unsaved changes', 'Would you like to save or discard them?']"
 />
```

> `subtitle` accepts both `String`s and `String` `Array`s. If an array is supplied, a `<p>` element will be inserted for every one.

### Button text & icons

The buttons can be customized using the `slot`s API.
You can inject your own text, icons, html, etc. into any part of the dialog.

```html
<UnsavedChangesDialog
  :title="Unsaved Changes">
  <template name="title">Destory the things?</template>
  <template name="body">Description</template>
  <template name="cancel-button">❌</template>
  <template name="discard-button">💀</template>
  <template name="save-button">✅</template>
</UnsavedChangesDialog>
```

### Styles & Animations

To use your own styles, use the unstyled build (`no-css.esm.js`).
You can copy the default styles (`no-css.esm.css`) into your project and customize it.


## Builds

There are 5 files in the `dist` directory:


| Extension | Use case | Notes |
|---|---|---|
|`.esm.js`| Standard ES6 module | Default build, for use in a Vue CLI project. Already minified for production |
|`no-css.esm.js`| Standard ES6 module without styling | ES6 build with all styles extracted to a separate `.esm.css` file for customization/overriding |
|`no-css.esm.css`| CSS styles for the unstyled ES6 build | Copy this into your project to customize the UI |
|`.min.js`| Browser build, requires no build system. | This is the file you'd get from the UNPKG cdn|
|`.ssr.js`| Rollup build for use with SSR. | Honestly, I'm not sure what it is, but it was in the rollup template I used. |

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


