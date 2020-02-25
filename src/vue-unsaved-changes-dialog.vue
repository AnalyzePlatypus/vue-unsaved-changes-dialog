<template>
  <div class="unsaved-changes-dialog">
    
    <!-- Desktop dialog -->
    <div class="desktop-dialog--root">
      <transition name="fade-zoom">
        <div class='desktop-dialog--wrapper' :style="positionStyle" :class="dynamicClasses" v-show="show">
          <div class="text-section">
            <h1>
              <slot name="title">{{title}}</slot>
            </h1>
            <p v-for="(str, idx) of subtitle" :key="idx">{{str}}</p>
             <slot name="body"/>
          </div>
          <div class="button-row">
            <button @click.stop="$emit('cancel')">
              <slot name="cancel-button">Cancel</slot>
            </button>
            <button class="button-danger" @click.stop="$emit('discard')">
              <slot name="discard-button">Discard</slot>
            </button>
            <button class="button-success" @click.stop="$emit('save')">
              <slot name="save-button">Save</slot>
            </button>
          </div>
        </div>
      </transition>
    </div>

    <!-- mobile dialog -->
    <div class="mobile-dialog--root">
      <!-- main dialog -->
      <transition name="mobile-animate">
          <div v-if="show" class='mobile-dialog--wrapper' :class="dynamicClasses">
            <div class="text-section">
              <h1>
                <slot name="title">{{title}}</slot>
              </h1>
              <p v-for="(str, idx) of subtitle" :key="idx">{{str}}</p>
              <slot name="body"/>
            </div>
            <div class="button-row">
              <button class="button-success" @click.stop="$emit('save')">
                <slot name="save-button">Save</slot>
              </button>
              <button class="button-danger" @click.stop="$emit('discard')">
                <slot name="discard-button">Discard</slot>
            </button>
            </div>
          </div>
      </transition>

      <!-- floating cancel button -->
      <transition name="mobile-animate">
          <div class='mobile-dialog--cancel-button' v-if="show">
             <button @click.stop="$emit('cancel')">
              <slot name="cancel-button">Cancel</slot>
            </button>
          </div>
      </transition>
    </div>

     <!-- darkened backdrop -->
     <transition name="fade">
      <div class="unsaved-changes-dialog--background-overlay" v-if="show" @click.stop="$emit('cancel')"></div>
    </transition>
  </div>
</template>

<script>

import throttle from "lodash.throttle";
import calculatePopupPosition from "./PopupPositionCalculator.js";

const CLOSE_ANIMATION_DURATION_MS = 400; 
const MOUSE_LISTENER_THROTTLE_MS = 100;

function dialogWasClosed(newShowVal, oldShowVal) {
  return newShowVal === false && oldShowVal === true;
}

export default {
  name: 'UnsavedChangesDialog',
  props: {
    show: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      required: false,
      default: "Unsaved Changes",
    },
    subtitle: {
      type: String | Array,
      required: false,
      default: () => ["You have made changes.", "Do you want to save or discard them?"]
    }
  },
  data() {
    return {
      position: {
        x: undefined,
        y: undefined
      },
      lastKnownMousePosition: {
        x: undefined,
        y: undefined
      },
      mouseClickListener:  throttle((e) => {
        e = e || window.event;
        this.lastKnownMousePosition = { x: e.clientX, y: e.clientY }
        this.calculatePopupPosition()
        if(this.show) this.deactivateMouseClickListener();
      }, MOUSE_LISTENER_THROTTLE_MS)
    }
  },
  mounted() {    
    this.activateMouseClickListener();
    this.calculatePopupPosition();
    window.addEventListener('resize', this.handleWindowResize);
  },
  beforeDestroy() {
    this.deactivateMouseClickListener();
    window.removeEventListener('resize', this.handleWindowResize);
  },
  methods: {
    activateMouseClickListener() {
      document.addEventListener('click', this.mouseClickListener);
    },
    deactivateMouseClickListener() {
      document.addEventListener('click', this.mouseClickListener);
    },
    handleWindowResize() {
      this.calculatePopupPosition();
    },
    calculatePopupPosition() {
      //if(!this.$refs.popupWrapper) return;
      this.position =  calculatePopupPosition({
        popupDimensions: {
          w: 287,//window.getComputedStyle(this.$refs.popupWrapper).getPropertyValue("width").replace("px", ""),
          h: 123//window.getComputedStyle(this.$refs.popupWrapper).getPropertyValue("height").replace("px", "")
        },
        windowDimensions: {
          w: window.innerWidth,
          h: window.innerHeight
        },
        mousePosition: {
          x: this.lastKnownMousePosition.x || this.windowCenterPoint.x,
          y: this.lastKnownMousePosition.y || this.windowCenterPoint.y
        },
        safeMargin: 30
      })
    }
  },
  computed: {
    windowCenterPoint() {
      return {
        x: window.innerWidth / 2,
        y: window.innerHeight /2
      }
    },
    positionStyle() {
      return `top:${this.position.y}px;left:${this.position.x}px;`;
    },
    dynamicClasses() {
      return this.show ? "" : "hide";
    }
  },
  watch: {
    show(newVal, oldVal) {
      if(dialogWasClosed(newVal, oldVal)) {
        setTimeout(this.activateMouseClickListener, CLOSE_ANIMATION_DURATION_MS);
      }
    }
  }
};
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='scss'>

$spacer__half: 16px;
$spacer__quarter: $spacer__half / 2;

$color-drab: #aaaeb3;
$color-drab--3: lighten($color-drab, 25);
$color-drab--4: lighten($color-drab, 20);
$color-drab--45: lighten($color-drab, 15);
$color-drab--5: $color-drab;

$color-danger--5: #ce0b24;
$color-success--5: #3bb26d;

$animation-enter-duration: 0.4s;
$animation-exit-duration: 0.15s;
$snappy-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1);

// Switch between desktop and mobile dialogs
// using CSS media queries
.unsaved-changes-dialog {
  @media screen and (min-width: 600px){
    .desktop-dialog--root {
      display: block;
    }

    .mobile-dialog--root {
      display: none;
    }
  }

  @media screen and (max-width: 599px){
    .desktop-dialog--root {
      display: none;
    }

    .mobile-dialog--root {
      display: block;
    }
  }
}

.unsaved-changes-dialog {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;

  &.hide {
    opacity: 0;
  }

  .text-section {
    margin-top: $spacer__half;
    padding-bottom: $spacer__quarter;
    margin-bottom: $spacer__quarter / 2;
    text-align: center;
  }

  h1 {
    font-size: 0.9rem;
    color: $color-drab--5;
    text-transform: uppercase;
    font-weight: 400;
    letter-spacing: 0.2px;
    margin-bottom: $spacer__quarter;
  }

  p {
    transform: translateZ(0);
    margin: 0px;
    line-height: 1.2rem;
    font-size: 0.9rem;
  }

  .button-row {
    border-top: 1px solid $color-drab--3;
    display: flex;
  }

  button {
    width: 100%;
    font-weight: 600;
    padding: $spacer__quarter 0px  $spacer__quarter 0px;
    border-radius: 0px;

    color: white;
    font-size: 0.9rem;
    font-weight: 600;
    border: none;
    text-decoration: none;
    transition: all 0.3s $snappy-timing-function;
    white-space: nowrap;
    height: fit-content;
    background: transparent;

    color: black;

    &:hover {
      background: $color-drab--4;
    }

    &:active {
      background: $color-drab--45;
    }
    
    &.button-danger {
      color: $color-danger--5;
    }

    &.button-danger:hover {
      background: $color-danger--5;
      color: white;
    }

    &.button-danger:active {
      background: darken($color-danger--5, 5);
      color: white;
    }

    &.button-success {
      color: $color-success--5;
    }

    &.button-success:hover {
      background: $color-success--5;
      color: white;
    }

    &.button-success:active {
      background: darken($color-success--5, 5);
      color: white;
    }
  }

  // Mobile buttons
  .mobile-dialog--root button {
    padding: 12px 0px;
    &:not(:last-of-type) {
      border-bottom: 1px solid $color-drab--3;
    }
    &:last-of-type {
      border-radius: 0px 0px 8px 8px;
    }
    &:only-child { // This prevents the cancel button from having rounded bottom and sharp top corners like a standard final button
      border-radius: 8px;
    }
  }
}


.unsaved-changes-dialog {
  .mobile-dialog--wrapper {
    z-index: 6;
    position: fixed;
    
    width: 95%;
    top: 50%;
    left: 50%;  
    transform: translateX(-50%) translateY(-50%);
    
    background: white;
    border-radius: 8px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.418);

    .button-row {
      flex-direction: column;
    }
  }

  .mobile-dialog--cancel-button {
    position: fixed;
    bottom: 8px;
    width: 95%;
    z-index: 6;
    background: white;
    border-radius: 8px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.418);
    
    left: 50%;
    transform: translateX(-50%);
  }
}

.unsaved-changes-dialog .desktop-dialog--wrapper {
  z-index: 6;
  position: fixed;
  width: 18rem;
  height: fit-content;

  background: white;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.418);

  .button-row {
    flex-direction: row;
    justify-items: space-between;
    width: 100%;
  }

  button {
     &:first-of-type {
      border-bottom-left-radius: 8px;
      border-right: 1px solid $color-drab--3;
    }
    &:last-of-type {
      border-bottom-right-radius: 8px;
      border-left: 1px solid $color-drab--3;
    }
  }
}


// Animations

.fade-zoom-enter-active {
  animation: fade-zoom $animation-enter-duration $snappy-timing-function;
}

.fade-zoom-leave-active {
  animation: fade-zoom $animation-exit-duration ease-in reverse;
}
@keyframes fade-zoom {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}

// Mobile animations

// Main dialog

.mobile-dialog--wrapper.mobile-animate-enter-active {
  animation: fade-zoom-autocenter-animation $animation-enter-duration $snappy-timing-function;
}

.mobile-dialog--wrapper.mobile-animate-leave-active {
  animation: reverse fade-zoom-autocenter-animation $animation-exit-duration $snappy-timing-function;
}


@keyframes fade-zoom-autocenter-animation {
  0% {
    opacity: 0;
    transform: translateX(-50%) translateY(-50%) scale(0.9);
  }
  100% {
    opacity: 1;
    transform: translateX(-50%) translateY(-50%) scale(1);
  }
}

// Cancel button

.mobile-dialog--cancel-button.mobile-animate-enter-active {
  animation: $animation-enter-duration close-button-animation $snappy-timing-function;
}

.mobile-dialog--cancel-button.mobile-animate-leave-active {
  animation: reverse $animation-exit-duration close-button-animation $snappy-timing-function;
}

@keyframes close-button-animation {
   0% {
    opacity: 0;
    transform: translateX(-50%) translateY(50px);
  }
  100% {
    opacity: 1;
    transform: translateX(-50%) translateY(0px);
  }
}

// Background overlay

.unsaved-changes-dialog--background-overlay {
  position: fixed;
  z-index: 5;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.7);
}

.fade-enter-active {
  animation: fade $animation-enter-duration  $snappy-timing-function;
}

.fade-leave-active {
  animation: fade 0.3s ease-in reverse;
}

@keyframes fade {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>