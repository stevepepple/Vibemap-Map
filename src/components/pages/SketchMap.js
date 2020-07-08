import React, { Component, Fragment } from "react";
import { Button, Dropdown, Icon, Menu, Segment } from 'semantic-ui-react'

import { find } from 'lodash'

//import simplify from '@turf/simplify';

import MapGL, { FullscreenControl, GeolocateControl } from 'react-map-gl'
//import ControlPanel from '../map/editor_control_panel'
//import SVG from 'react-inlinesvg'

import Hotkeys from 'react-hot-keys'

import CanvasDraw from "react-canvas-draw";

import { connect } from 'react-redux'
import * as actions from '../../redux/actions'

import * as Constants from '../../constants.js'

import Header from '../elements/header.js'
import DrawEditor from '../map/Editor.js'
import Slider from '../elements/slider.js'

import styles from "./SketchMap.css";


class SketchMap extends Component {
    constructor(props) {
        super(props)
        this.mapRef = React.createRef();

        this.handleCanvasChange = this.handleCanvasChange.bind(this)
        this.handlePen = this.handlePen.bind(this)
        this.handleMarker = this.handleMarker.bind(this)
        this.handlePrint = this.handlePrint.bind(this)
        this.handleShape = this.handleShape.bind(this)
        this.handleSlider = this.handleSlider.bind(this)

        this.undo = this.undo.bind(this)
        this._onViewportChange = this._onViewportChange.bind(this)
        
        this.state = {
            brushRadius: 3,
            color: 'green',
            colors: [
                {
                    key: 'green',
                    value: 'green',
                    label: { color: 'green', empty: true, circular: true },
                },
                {
                    key: 'yellow',
                    value: 'yellow',
                    label: { color: 'yellow', empty: true, circular: true },
                },
                {
                    key: 'orange',
                    value: 'orange',
                    label: { color: 'orange', empty: true, circular: true },
                }, 
                {
                    key: 'grey',
                    value: 'grey',
                    label: { color: 'grey', empty: true, circular: true },
                }],
            data: [],
            loaded: false,
            instructions: 'Pick a tool above',
            modes: [
                { key: 'EDITING', title: 'Edit', icon: 'mouse pointer', value: 'EDITING', instructions: 'Pick a tool above.' },
                { key: 'DRAW_POINT', title: 'Draw', icon: 'marker',  value: 'DRAW_POINT', instructions: 'Click map to add a point' },
                { key: 'DRAW_PATH', title: 'Path', icon: 'line', value: 'DRAW_PATH', instructions: 'Click two points' },
                { key: 'DRAW_POLYGON', title: 'Polygon', icon: 'vector', value: 'DRAW_POLYGON', instructions: 'Click one or more points to make a shape' },
                { key: 'DRAW_RECTANGLE', title: 'Rectangle', icon: 'rectangle', value: 'DRAW_RECTANGLE', instructions: 'Click and drag'  }
            ],
            options: [],
            placeholder: "Loading",
            save_drawing_data: null,
            selectedMode: 'READ_ONLY',
            selectedFeatureIndex: null,
            showPen: false,
            sliderValue: 3,
            viewport: {
                latitude: 37.7577,
                longitude: -122.4376,
                zoom: 12
            }
        }

        this._editorRef = null;
        this.map = React.createRef()
    }

    componentWillReceiveProps(nextProps, prevState) {
        this.setState({
            update_layer: false,
            /*
            viewport: {
                bearing: nextProps.bearing,
                latitude: nextProps.currentLocation.latitude,
                longitude: nextProps.currentLocation.longitude,
                zoom: nextProps.zoom
            }
            */
        })
    }

    componentDidMount() {
        let size = {
            height: this.map.current.offsetHeight,
            width: this.map.current.offsetWidth
        }

        // These both need size at the same time
        this.props.setMapSize(size)
        this.props.setMapReady(true)
    }

    handleCanvasChange(event) {
        // Reference to Mapbox GL API
        const mapGL = this.mapRef.current.getMap()

        console.log('handleCanvasChange: ', event)

        // Get line strings from Canvas
        let save_data = JSON.parse(this.canvasDraw.getSaveData())
        console.log('save_data: ', save_data)

        let feature = {
            "type": "Feature",
            "geometry": { "type": "Polygon", "coordinates": [] },
            "properties": { renderType: "Polygon", id: null }
        }

        // Project to Long-Lats
        const lines = save_data['lines']

        let coordinates = lines.map((line) => {
            console.log('Line face: ', line['points'])
            feature['properties']['line_color'] = line['brushColor']
            feature['properties']['line_width'] = line['brushRadius']

            let points = line['points'].map((point) => mapGL.unproject(point).toArray())

            return points
        })

        console.log('Points to coordinations: ', coordinates)
        feature['properties']['id'] = this.props.editorReducer.numFeatures
        feature['geometry']['coordinates'] = coordinates

        //let simplified = simplify(feature, { tolerance: 0.01, mutate: true, highQuality: true});

        this.props.addFeature(feature)
        // TODO: Add new feature coordinates via Redux

        //let first_line = lines[0]
        //let first_point = first_line['points'][0]
    }

    handleMarker() {
        // Toggle the rendering of the pen tool
        this.setState({ activeItem: 'marker', selectedMode : 'DRAW_POINT' })
    }

    handlePen() {
        // Toggle the rendering of the pen tool
        let showPen = this.state.showPen
        this.setState({ showPen : !showPen })        

        if (showPen === true) this.setState({ activeItem : 'pen'})
    }

    handleShape() {
        this.setState({ activeItem: 'shape', showPen : false })
    }

    // TODO: Handle a unified group of features from drawing canvas and Mapbox draw. 
    // 1. Save all objects as Geojson. 
    // 2. Use Mapbox util so save xy coodinations from the page as longitude-latitude
    // 3. Save history in a way that can be undone. 
    // -- Canvas Draw doesn't this nicely. Research how they do it. 
    // -- Simplify drawn shapes with Turf: https://turfjs.org/docs/
    // 4. Allow annotation messages for each
    // 5. Ability to show history. 

    save() {
        try {
            let save_data = this.canvasDraw.getSaveData()
            console.log(save_data)
        } catch (error) {
            console.log('Problem undoing')
        }
    }

    undo() {
        try {
            this.canvasDraw.undo()            
        } catch (error) {
            console.log('Problem undoing')
        }
    }

    handlePrint() {
        const mapGL = this.mapRef.current.getMap()

        if (this.canvasDraw) {
            let save_data = this.canvasDraw.getSaveData()
            console.log(save_data)
        }

        // TODO: The images object doesn't show anything; hook directly to the Mapbox map object
        //let canvas = document.getElementsByClassName('mapboxgl-canvas')[0]
        let canvas = mapGL.getCanvas()
        let image = canvas.toDataURL("image/png")
        console.log(image)

        // Here's how to create a link and click it
        const link = document.createElement("a");
        link.href = image;
        link.setAttribute("download", "image.png"); //or any other extension
        document.body.appendChild(link);
        link.click();
    }

    handlePenColor = (e, { name, value }) => this.setState({ color: value, activeItem: 'pen', showPen : true })

    handleRemove = () => {
        // TODO: How to use the same control to talk to multiple components with different states.
        if (this.canvasDraw) {
            let save_data = this.canvasDraw.getSaveData()
            console.log(save_data)
            this.canvasDraw.clear()
        }

        if (this.state.activeItem === 'shape') {
            this.setState({ selectedMode: 'DELETE' })
        }

    }

    handleSlider = (value) => this.setState({ sliderValue: value})

    switchMode = (e, { name, value }) => {
        const selectedMode = value

        // Pick current instructinos
        const selectedOption = find(this.state.modes, function(o) { return o.key === selectedMode  })

        this.setState({
            instructions: selectedOption['instructions'],
            selectedMode: selectedMode === this.state.selectedMode ? null : selectedMode
        });
    }

    _onViewportChange = viewport => {
        this.props.setViewport(viewport)
        this.setState({ viewport })
    }

    render() {
        const { viewport, selectedMode } = this.state;
        const { activeItem } = this.state

        return (
            <Fragment className='sketchMap'>
                <Header />
                <Segment.Group style={{ marginTop: '6%', marginLeft: '20%', height: '70%', width: '70%' }}>
                    <Hotkeys
                        keyName="ctrl+z"
                        onKeyDown={this.undo.bind(this)}
                    />

                    <Menu borderless fluid icon attached='top' size='large' style={{ zIndex: '30'}}>
                        <Menu.Item name='pen'
                            active={activeItem === 'pen'}
                            onClick={this.handlePen}>
                            <Dropdown
                                basic
                                button
                                //disabled={activeItem !== 'pen'}
                                text=''
                                className='icon pencil menuIcon'
                                floating
                                icon='pencil'
                                onClick={this.handlePen}
                                onChange={this.handlePenColor}
                                options={this.state.colors}
                                defaultValue='grey'>
                            </Dropdown>
                        </Menu.Item>

                        <Menu.Item name='shape'
                            active={activeItem === 'shape'}
                            onClick={this.handleShape}>
                                <Dropdown
                                    basic
                                    button
                                    //disabled={activeItem !== 'pen'}
                                    text=''
                                    className='icon menuIcon'
                                    icon='vector'
                                    floating
                                    labeled={false}
                                    onClick={this.handleShape}
                                    onChange={this.switchMode}
                                    options={this.state.modes}>
                                </Dropdown>
                        </Menu.Item>

                        <Menu.Item name='marker'
                            active={activeItem === 'marker'}
                            onClick={this.handleShape}>
                            <Dropdown
                                basic
                                button
                                //disabled={activeItem !== 'pen'}
                                text=''
                                className='icon marker menuIcon'
                                icon='map marker alternate'
                                floating
                                labeled={false}
                                onClick={this.handleMarker}
                                onChange={this.switchMode}>
                            </Dropdown>
                        </Menu.Item>
                        
                        <Menu.Item name='undo' onClick={this.undo} position='right'>
                            <Icon name='undo' />
                        </Menu.Item>

                        <Menu.Item name='send'>
                            <Icon name='paper plane' />
                        </Menu.Item>

                        <Menu.Item
                            name='print'
                            active={activeItem === 'print'}
                            onClick={this.handlePrint}>
                            <Icon name='save outline' />
                        </Menu.Item>
                    </Menu>

                    <div id="map_container" className='map_container' ref={this.map} style={{ width: '100%', height: '100%' }}>
                        
                        {this.state.showPen &&
                            <CanvasDraw 
                                className='canvasDraw'
                                ref={canvasDraw => (this.canvasDraw = canvasDraw)}
                                style={{ position: "absolute" }} 
                                brushColor={this.state.color}
                                brushRadius={this.state.sliderValue}
                                canvasHeight={this.props.mapSize.height}
                                canvasWidth={this.props.mapSize.width}
                                onChange={this.handleCanvasChange} 
                                saveData={this.state.save_drawing_data}/>
                        }

                        <Menu style={{ position: 'absolute', top: '6.4em', left: '1em', zIndex: 20 }}>
                            <Slider defaultValue={this.state.sliderValue} onChange={this.handleSlider} />
                            <Button icon onClick={this.handleRemove}>
                                <Icon name='trash alternate' />
                            </Button>
                            <Button.Group color={this.state.color}>
                                <Dropdown
                                    button
                                    //disabled={activeItem !== 'pen'}
                                    text=''
                                    className='icon'
                                    floating
                                    icon='eyedropper'
                                    //onClick={this.handlePen}
                                    onChange={this.handlePenColor}
                                    options={this.state.colors}
                                    defaultValue='grey'>
                                </Dropdown>
                            </Button.Group>
                        </Menu>

                        <div style={{ position: 'absolute', left: '1em', top: '12em', zIndex: 10}}>
                            {this.state.instructions}
                        </div>

                        <MapGL
                            {...viewport}
                            width='100%'
                            height='100%'
                            transition={{ "duration": 300, "delay": 0 }}
                            mapboxApiAccessToken={Constants.MAPBOX_TOKEN}
                            mapStyle={Constants.MAPBOX_STYLE_LIGHT}
                            ref={this.mapRef}
                            preserveDrawingBuffer={true}
                            onViewportChange={this._onViewportChange}>

                            <GeolocateControl
                                style={{ position: 'absolute', right: 3, top: 40, margin: 10, width: 30 }}
                                positionOptions={{ enableHighAccuracy: true }}
                                trackUserLocation={true}
                            />

                            <FullscreenControl container={document.querySelector('body')} />

                            <DrawEditor
                                ref={_ => (this._editorRef = _)}
                                style={{ width: '100%', height: '100%' }}
                                clickRadius={12}
                                mode={selectedMode}
                            />
                            
                        </MapGL>
                    </div>
                </Segment.Group>
            </Fragment>
            
        );
    }
}

const mapStateToProps = state => {

    return {
        currentLocation: state.nav.currentLocation,
        editorReducer: state.editorReducer,
        windowSize: state.windowSize,
        // Map
        mapSize: state.map.mapSize,
        viewport: state.map.viewport, 
        zoom: state.map.zoom
    }
}

export default connect(mapStateToProps, actions)(SketchMap)