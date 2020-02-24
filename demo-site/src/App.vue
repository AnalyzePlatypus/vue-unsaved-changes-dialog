<template>
  <div id="app" @click="shouldShowDialog = true">
    <h1>Vue Unsaved Changes Dialog</h1>
    <p>Click anywhere to show the dialog</p>
    <VueUnsavedChangesDialog
      :show="shouldShowDialog"
      @cancel="shouldShowDialog = false"
      @discard="shouldShowDialog = false"
      @save="shouldShowDialog = false"/>
  </div>
</template>

<script>
import VueUnsavedChangesDialog from './../../src/vue-unsaved-changes-dialog';

export default {
  name: 'App',
  data() {
    return {
      visible: false,
      shouldShowDialog: false,
    }
  },
  components: {
    VueUnsavedChangesDialog
  }
}
</script>

<style lang="scss">
body {
  margin: 0px;
}

#app {
  min-height: 100vh;
  // background: lightcoral;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding-top: 60px;
}
</style>
