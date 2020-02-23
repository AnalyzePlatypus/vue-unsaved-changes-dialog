function calculatePopupPosition({windowDimensions, popupDimensions, mousePosition, safeMargin}) {  
  if(!safeMargin) safeMargin = 0;

  return {
    x: getX({
      windowWidth: windowDimensions.w, 
      popupWidth: popupDimensions.w, 
      mousePositionX: mousePosition.x, 
      safeMargin
    }),
    y: getY({
      windowHeight: windowDimensions.h, 
      popupHeight: popupDimensions.h, 
      mousePositionY: mousePosition.y, 
      safeMargin
    })
  }
}

function getX({windowWidth, popupWidth, mousePositionX, safeMargin}) {
  if(isWindowEdgeOrOffscreen(mousePositionX)) return safeMargin;

  const popupHalfWidth = popupWidth / 2;
  const naiveXPosition = mousePositionX - popupHalfWidth;
  
  const popupRightEdge = naiveXPosition + popupWidth;
  const popupLeftEdge = naiveXPosition;
  
  if(isOffscreenLeft(popupLeftEdge, safeMargin)) {
    const missingWidth =  safeMargin - popupLeftEdge;
    return naiveXPosition + missingWidth;
  }

  if(isOffscreenRight(popupRightEdge, windowWidth)) {
    const excessWidth = popupRightEdge - windowWidth;
    return naiveXPosition - excessWidth - safeMargin;
  }

  return naiveXPosition;
}

function getY({windowHeight, popupHeight, mousePositionY, safeMargin}) {
  if(isWindowEdgeOrOffscreen(mousePositionY)) return safeMargin;

  const popupHalfHeight = popupHeight / 2;
  const naiveYPosition = mousePositionY - popupHalfHeight;

  const popupTopEdge = naiveYPosition;
  if(isOffscreenTop(popupTopEdge, safeMargin)) {
    const missingHeight =  safeMargin - popupTopEdge;
    return naiveYPosition + missingHeight;
  }

  const popupBottomEdge = naiveYPosition + popupHeight;
  if(isOffscreenBottom(popupBottomEdge, windowHeight)) {
    const excessHeight = popupBottomEdge - windowHeight;
    return naiveYPosition - excessHeight - safeMargin;
  }

  return naiveYPosition;
}

const isWindowEdgeOrOffscreen = (position) =>  position < 1;
const isOffscreenLeft   = (popupLeftEdge, safeMargin) => popupLeftEdge <= safeMargin;
const isOffscreenRight  = (popupRightEdge, windowWidth) => popupRightEdge >= windowWidth;
const isOffscreenTop    = (popupTopEdge, safeMargin) => popupTopEdge <= safeMargin
const isOffscreenBottom = (popupBottomEdge, windowHeight) => popupBottomEdge >= windowHeight;

export default calculatePopupPosition;