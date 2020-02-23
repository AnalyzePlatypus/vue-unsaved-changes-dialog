<template>
    <transition name="edit-guard-popup">
    <div class='cancel-edit-popup--wrapper' data-test-hook='edit-guard-popup' :style="positionStyle" :class="dynamicClasses" ref="popupWrapper" v-show="show">
      <div class="text-section">
        <h1 class="nudge-bottom__quarter">Unsaved Changes</h1>
        <p>You have made changes.</p>
        <p>Do you want to save or discard them?</p>
      </div>
      <div class="flex horiz justify-between">
        <button class="button-drab__borderless" data-test-hook="cancel-button" @click="$emit('cancel')">
            Cancel
        </button>
        <button class="button-danger__borderless" data-test-hook="discard-button" @click="$emit('discard')">
          Discard
        </button>
        <button class="button-success__borderless" data-test-hook="save-button" @click="$emit('save')">
          Save
        </button>
      </div>
    </div>
     </transition>

</template>

<script>

import calculatePopupPosition from "@/PopupPositionCalculator.js";

export default {
  name: 'EditGuardPopup',
  data() {
    return {
      show: false,
      positionX: 0,
      positionY: 0,
      mouseListener: () => {}
    }
  },
  mounted() {
    console.log('EditGuardPopup mounted');
    
    const handler = (e) => {
       e = e || window.event;
      
      if(!this.$refs.popupWrapper) return;
      const position = calculatePopupPosition({
        popupDimensions: {
          w: 287,//window.getComputedStyle(this.$refs.popupWrapper).getPropertyValue("width").replace("px", ""),
          h: 123//window.getComputedStyle(this.$refs.popupWrapper).getPropertyValue("height").replace("px", "")
        },
        windowDimensions: {
          w: window.innerWidth,
          h: window.innerHeight
        },
        mousePosition: {
          x: e.clientX,
          y: e.clientY
        },
        safeMargin: 30
      })

      this.positionX = position.x;
      this.positionY = position.y;
      this.show = true;
      this.deactivateListener();
    }
    this.mouseListener = handler;
    document.addEventListener('mousemove', handler);
  },
  methods: {
    deactivateListener() {
      document.removeEventListener('mousemove', this.mouseListener);
    }
  },  
  computed: {
    positionStyle() {
      return `top:${this.positionY}px;left:${this.positionX}px;`;
    },
    dynamicClasses() {
      return [
        this.show ? "" : "hide" 
      ]
    }
  }
};
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='scss'>
// @import '@/assets/css/global/global.scss';

.cancel-edit-popup--wrapper {
  position: fixed;
  
  width: 18rem;
  height: fit-content;

  background: white;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.418);

  &.hide {
    opacity: 0;
  }

  .text-section {
    margin-top: $spacer__half;
    padding-bottom: $spacer__quarter;
    text-align: center;
    border-bottom: 1px solid $color-drab--3;
  }

  h1 {
    font-size: 0.9rem;
    color: $color-drab--5;
    text-transform: uppercase;

  }

  p {
    margin: 0px;
    line-height: 1.2rem;
    font-size: 0.9rem;
  }

  button {
    width: 100%;
    font-weight: 600;
    padding: $spacer__quarter 0px  $spacer__quarter 0px;
    border-radius: 0px;

    &.button-danger__borderless:hover {
      background: $color-danger--5;
      color: white;
    }

     &.button-success__borderless:hover {
      background: $color-success--5;
      color: white;
    }

    &:first-of-type {
      border-bottom-left-radius: 8px;
      border-right: 1px solid $color-drab--3;
      color: black;
      &:hover {
        background: $color-drab--4;
      }
    }
    &:last-of-type {
      border-bottom-right-radius: 8px;
      border-left: 1px solid $color-drab--3;
    }
  }
}

$animation-duration: 0.5s;

.edit-guard-popup-enter-active {
  animation: edit-guard-popup $animation-duration $snappy-timing-function;
}

.edit-guard-popup-leave-active {
  animation: edit-guard-popup $animation-duration ease-in reverse;
}

@keyframes  edit-guard-popup {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}

</style>