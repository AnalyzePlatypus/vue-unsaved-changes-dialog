# Vue UNsaved Changes Dialog

A Vue component inspired by the new skeumorphic segmented control in iOS 13.

[Live demo › ](https://vue-unsaved-changes-dialog.netlify.com)

![Demo GIF](/demo.gif)

## Install

```bash
npm i vue-unsaved-changes-dialog
```

## Usage

```html
<ios13-segmented-control v-model="value" :segments="segments"/>
```

```javascript
import iOS13SegmentedControl from "@/vue-ios13-segmented-control.vue";

export default {
  name: 'MyComponent',
  components: { 
    "ios13-segmented-control": iOS13SegmentedControl
  }
  data() {
    return {
      value: "42",
      segments: [
        {
          title: "Apple Music",
          id: "0"
        },
        {
          title: "Spotify",
          id: "1"
        },
        {
          title: "Deezer",
          id: "2"
        },
      ]
    };
  },
  
};
</script>

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

* "iOS 13" is trademark by Apple Inc.

## Other

Throughout this package, "iOS 13" is universally spelled as a single word: `ios13`
