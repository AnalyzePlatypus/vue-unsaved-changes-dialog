<template>
  <div>
    <transition name="unsaved-changes-animate">
      <div class='unsaved-changes-dialog--wrapper' data-test-hook='unsaved-changes-animate' :style="positionStyle" :class="dynamicClasses" ref="popupWrapper" v-show="show">
        <div class="text-section">
          <h1 class="nudge-bottom__quarter">{{title}}</h1>
          <p>You have made changes.</p>
          <p>Do you want to save or discard them?</p>
        </div>
        <div class="button-row">
          <button class="button-drab__borderless" data-test-hook="cancel-button" @click.stop="$emit('cancel')">
            Cancel
          </button>
          <button class="button-danger" data-test-hook="discard-button" @click.stop="$emit('discard')">
            Discard
          </button>
          <button class="button-success" data-test-hook="save-button" @click.stop="$emit('save')">
            Save
          </button>
        </div>
      </div>
    </transition>

     <transition name="fade">
      <div class="unsaved-changes-dialog--background-overlay" v-if="show" @click.stop="handleOverlayClick"></div>
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
    console.log("Mounted activate mouse listener");
    
    this.activateMouseClickListener();    
    this.calculatePopupPosition();

    console.log("Mouse listener installed");
    
    window.addEventListener('resize', this.handleWindowResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleWindowResize);
    this.deactivateMouseClickListener();
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
    handleOverlayClick(event) {
      this.lastKnownMousePosition = {
        x: event.clientX,
        y: event.clientY
      }      
      this.$emit('cancel');
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
// @import '@/assets/css/global/global.scss';


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
$animation-exit-duration: 0.1s;
$snappy-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1);

.unsaved-changes-dialog--wrapper {
  z-index: 6;
  position: fixed;
  
  width: 18rem;
  height: fit-content;

  background: white;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.418);

  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;

  .nudge-bottom__quarter {
    margin-bottom: $spacer__quarter;
  }

  &.hide {
    opacity: 0;
  }

  .text-section {
    margin-top: $spacer__half;
    padding-bottom: $spacer__quarter;
    margin-bottom: $spacer__quarter / 2;
    text-align: center;
    transform: scale(1);
  }

  h1 {
    font-size: 0.9rem;
    color: $color-drab--5;
    text-transform: uppercase;
    font-weight: 400;
    letter-spacing: 0.2px;
    
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
    flex-direction: row;
    justify-items: space-between;
    width: 100%;
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



.unsaved-changes-animate-enter-active {
  animation: unsaved-changes-animate $animation-enter-duration $snappy-timing-function;
}

.unsaved-changes-animate-leave-active {
  animation: unsaved-changes-animate $animation-exit-duration ease-in reverse;
}

@keyframes  unsaved-changes-animate {
  0% {
    opacity: 0;
    transform: scale(0.8) translateZ(0) ;
  }

  100% {
    opacity: 1;
    transform: scale(1) translateZ(0);
  }
}

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