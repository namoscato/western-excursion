import alphaify from 'alphaify';
import Immutable from 'immutable';
import MapGL from 'react-map-gl';
import React from 'react';

import ClickablePointsOverlay from './clickable-points-overlay';
import config from './config';
import data from './data/points.json';

const propTypes = {
    height: React.PropTypes.number.isRequired,
    onClickPoint: React.PropTypes.func.isRequired,
    width: React.PropTypes.number.isRequired,
};

export default class Map extends React.Component {

    constructor(props) {
        super(props);

        this.mapboxApiAccessToken = config.MAPBOX_API_ACCESS_TOKEN;

        const points = [];

        data.features.forEach((feature, i) => {
            if (feature.geometry.type !== 'Point') {
                return;
            }

            points.push({
                id: i,
                location: feature.geometry.coordinates,
                properties: feature.properties,
            });
        });

        this.state = {
            viewport: {
                isDragging: null,
                latitude: 40.7716204,
                longitude: -108.7061596,
                startDragLngLat: null,
                zoom: 4.7,
            },
            points: Immutable.fromJS(points),
        };
    }

    render() {
        const viewport = {
            ...this.state.viewport,
            height: this.props.height,
            width: this.props.width,
        };

        return (
            <MapGL
                {...viewport}
                mapboxApiAccessToken={this.mapboxApiAccessToken}
                onChangeViewport={viewportValue => this.setState({ viewport: viewportValue })}
            >
                <ClickablePointsOverlay
                    {...viewport}
                    key="clickable-overlay"
                    points={this.state.points}
                    onClickPoint={this.props.onClickPoint}
                    renderPoint={
                        point => (
                            <g>
                                <circle
                                    style={{ fill: alphaify('#000', 0.5), pointerEvents: 'all' }}
                                    r={10}
                                />
                                <text
                                    style={{ fill: 'white', textAnchor: 'middle' }}
                                    y={5}
                                >
                                    { point.get('id') }
                                </text>
                            </g>
                        )
                    }
                />
            </MapGL>
        );
    }
}

Map.propTypes = propTypes;
