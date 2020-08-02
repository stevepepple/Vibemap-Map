import React, { Component, Fragment } from 'react'
import isEqual from 'react-fast-compare'

import MapGL from 'react-map-gl';
import { Editor, EditorModes } from 'react-map-gl-draw'

import { connect } from 'react-redux'
import * as actions from '../../redux/actions'

import { getFeatureStyle, getEditHandleStyle } from '../map/editor_style'
 
class DrawEditor extends Component {
    constructor(props) {
        super(props)

        this._renderToolbar = this._renderToolbar.bind(this)

        console.log('EditorModes: ', EditorModes)
        //this._renderControlPanel = this._renderControlPanel.bind(this)

        this.state = {
            // map
            modes: [
                { key: EditorModes.EDITING, text: 'Edit', value: 'EDITING' },
                { key: EditorModes.DRAW_POINT, text: 'Draw', value: 'DRAW_POINT' },
                { key: EditorModes.DRAW_PATH, text: 'Path', value: 'DRAW_PATH' },
                { key: EditorModes.DRAW_POLYGON, text: 'Polygon', value: 'DRAW_POLYGON' },
                { key: EditorModes.DRAW_RECTANGLE, text: 'Rectangle', value: 'DRAW_RECTANGLE' }
            ],
            // editor
            selectedMode: EditorModes[this.props.mode],
            selectedFeatureIndex: null
        }
    }

    componentWillReceiveProps(nextProps, prevState) {
        this.setState({ selectedMode: EditorModes[nextProps.mode]})

        if (nextProps.mode === 'DELETE') this._onDelete()

        // Add features added via Redux
        if (!isEqual(nextProps.editorReducer, this.props.editorReducer)) this._handleFeatures(nextProps.editorReducer['features'])
    }

 
    _switchMode = evt => {
        const selectedMode = evt.target.id;
        this.setState({
            selectedMode: selectedMode === this.state.selectedMode ? null : selectedMode
        });
    }

    _handleFeatures = (features) => {
        console.log('_handleFeatures: ', features, this._editorRef)
        // TODO: Also see if feature is already in the editor?
        console.log('Add this feature: ', features) 
        this._editorRef.addFeatures(features)
    }

    _onSelect = options => {
        
        console.log(options.selectedFeature)
        //this._editorRef.addFeatures(options.selectedFeature)

        this.setState({ selectedFeatureIndex: options && options.selectedFeatureIndex });
    }

    _onDelete = () => {
        const selectedIndex = this.state.selectedFeatureIndex;
        if (selectedIndex !== null && selectedIndex >= 0) {
            this._editorRef.deleteFeatures(selectedIndex);
        }
    }

    _renderDrawTools = () => {
        return (
            <div className="mapboxgl-ctrl-top-left" style={{ position: ' absolute', left: '1em', zIndex: 100 }}>
                <button onClick={this._onDelete}>Delete</button>
                {/* 
                <select onChange={this._switchMode}>
                    <option value="">--Please choose a mode--</option>
                    {this.state.map(mode => <option value={mode.id}>{mode.text}</option>)}
                </select>
                */}
            </div>
        );
    }

    _onUpdate = ({ editType }) => {
        if (editType === 'addFeature') {
            this.setState({
                selectedMode: EditorModes.EDITING
            });
        }
    }

    _renderToolbar = () => {
    return (
        <div style={{position: 'absolute', top: 0, left: '1em', maxWidth: '320px'}}>
            {/* 
            <button onClick={this._onDelete}>Delete</button>
            <select onChange={this._switchMode}>
                <option value="">--Please choose a mode--</option>
                {this.state.modes.map(mode => <option value={mode.id}>{mode.text}</option>)}
            </select>
            */}
        </div>
    )
    }

    render() {
    const { viewport, selectedMode } = this.state
    const { editHandleShape } = this.props

    return (
        <Fragment>
            <Editor
                ref={_ => (this._editorRef = _)}
                clickRadius={16}
                editHandleShape={editHandleShape}
                onSelect={this._onSelect}
                onUpdate={this._onUpdate}
                mode={selectedMode}
                //featureStyle={getFeatureStyle}
                editHandleStyle={getEditHandleStyle}
            />

            {this._renderToolbar()}
        </Fragment>   
    );
    }
}

const mapStateToProps = state => {

    return {
        editorReducer: state.editorReducer,
        mapSize: state.map.mapSize,
        windowSize: state.windowSize,
        viewport: state.map.viewport,
    }
}

DrawEditor.defaultProps = {
    editHandleShape: 'circle',
    selectedMode: 'READ_ONLY'
}


export default connect(mapStateToProps, actions)(DrawEditor)