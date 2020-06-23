/// my-map-controller.js
  import {MapController} from 'react-map-gl';

  const ZOOM_ACCEL = 0.005
  const NO_TRANSITION_PROPS = {
    transitionDuration: 0
  }

  export default class CustomMapController extends MapController {


    // TODO: handle current location button and zoom level for this action.
    
    _onPan(event) {
      return this.isFunctionKeyPressed(event) || event.rightButton ?
        //  Default implementation in MapController
        this._onPanRotate(event) : this._onPanMove(event);
    }


    _onWheel(event) {
        if (!this.scrollZoom) {
            return false;
        }

        event.preventDefault();

        const pos = this.getCenter(event);
        const { delta } = event;

        // Map wheel delta to relative scale
        let scale = 2 / (1 + Math.exp(-Math.abs(delta * ZOOM_ACCEL)));
        if (delta < 0 && scale !== 0) {
            scale = 1 / scale;
        }

        const newMapState = this.mapState.zoom({ pos, scale });
        this.updateViewport(newMapState, NO_TRANSITION_PROPS, { isZooming: true });
        // Wheel events are discrete, let's wait a little before resetting isZooming
        this._onWheelEnd();
        return true;
    }

    
  }