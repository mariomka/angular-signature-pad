'use strict'

import angular from 'angular'
import SignaturePad from 'signature_pad'
import * as canvasManipulation from '@blinkmobile/canvas-manipulation'

BmSignaturePadController.$inject = ['$scope', '$element', '$attrs', '$window', '$log']

function BmSignaturePadController ($scope, $element, $attrs, $window, $log) {
  if (!SignaturePad) {
    $log.error('SignaturePad is required')
    return
  }
  const vm = this
  const element = $element[0]
  const canvas = element.children[0]
  let signaturePad

  // Set canvas initial size to fill parent element: <bm-signature-pad></bm-signature-pad>
  canvas.width = element.clientWidth
  canvas.height = element.clientHeight

  vm.$onDestroy = () => {
    if (signaturePad && angular.isFunction(signaturePad.off)) {
      signaturePad.off()
    }
  }
  vm.$onInit = () => {
    const opts = vm.options || {}
    const getSignature = () => {
      if (!signaturePad || signaturePad.isEmpty()) {
        return undefined
      }

      const args = [
        vm.imageType ? vm.imageType() : undefined,
        vm.imageEncoder ? vm.imageEncoder() : undefined
      ]
      if (vm.crop && vm.crop()) {
        return canvasManipulation.toDataURLCropped(canvas, ...args)
      } else {
        return signaturePad.toDataURL(...args)
      }
    }

    // Need to wrap the onBegin and onEnd in an $apply to ensure a digest cycle is started
    const onBegin = opts.onBegin
    if (angular.isFunction(onBegin)) {
      opts.onBegin = (event) => {
        onBegin(event)
        $scope.$applyAsync()
      }
    }

    const onEnd = opts.onEnd
    opts.onEnd = (event) => {
      vm.ngModel.$setViewValue(getSignature())
      if (angular.isFunction(onEnd)) {
        onEnd(event)
      }
      $scope.$applyAsync()
    }

    signaturePad = new SignaturePad(canvas, opts)

    // Functions that are made available to the parent component
    if (vm.resize) {
      vm.resize({
        $fn: () => {
          const width = element.clientWidth
          const height = element.clientHeight
          // If canvas is empty we dont need to call resize or set the model
          if (vm.ngModel.$isEmpty()) {
            canvas.width = width
            canvas.height = height
          } else {
            const contentPreserved = canvasManipulation.resize(canvas, width, height, vm.scaleDown && vm.scaleDown())
            if (!contentPreserved) {
              signaturePad.clear()
            }
            vm.ngModel.$setViewValue(getSignature())
          }
        }
      })
    }

    // Specify how the model is deemed empty
    vm.ngModel.$isEmpty = () => signaturePad.isEmpty()
    // Specify how UI should be updated
    vm.ngModel.$render = () => {
      if (vm.ngModel.$viewValue) {
        var image = new Image();

        signaturePad._reset();
        image.src = vm.ngModel.$viewValue;
        image.onload = function () {
          canvasManipulation.drawImageCentered(canvas, image);
        };
        signaturePad._isEmpty = false;
      } else {
        signaturePad.clear()
      }
    }

    // Observe changes to disabled attribute if using ngDisabled
    if ($attrs.ngDisabled) {
      $attrs.$observe('disabled', (disabled) => disabled ? signaturePad.off() : signaturePad.on())
    }

    if ($attrs.options) {
      const keys = [
        'dotSize',
        'minWidth',
        'maxWidth',
        'throttle',
        'minDistance',
        'backgroundColor',
        'penColor',
        'velocityFilterWeight',
      ]
      $scope.$watch(() => vm.options, (newValue) => {
        Object.keys(newValue).forEach((key) => {
          if (keys.some(k => k === key)) {
            signaturePad[key] = newValue[key]
          }
        })
      }, true)
    }
  }
}

const bmSignaturePadComponent = {
  template: '<canvas class="signature-pad">Your browser does not support the HTML5 canvas tag.</canvas>',
  controller: BmSignaturePadController,
  require: {
    ngModel: 'ngModel'
  },
  bindings: {
    options: '<?',
    crop: '&?',
    imageType: '&?',
    imageEncoder: '&?',
    scaleDown: '&?',
    resize: '&?'
  }
}

export default angular
  .module('bmSignaturePad', [])
  .component('bmSignaturePad', bmSignaturePadComponent)
