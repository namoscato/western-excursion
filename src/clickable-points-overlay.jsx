import autobind from 'autobind-decorator';
import Immutable from 'immutable';
import React, { PropTypes, Component } from 'react';
import transform from 'svg-transform';
import viewportMercator from 'viewport-mercator-project';

function noop() {}

const propTypes = {
    height: PropTypes.number.isRequired,
    latitude: PropTypes.number.isRequired,
    lngLatAccessor: PropTypes.func.isRequired,
    longitude: PropTypes.number.isRequired,
    onClickPoint: PropTypes.func.isRequired,
    points: PropTypes.instanceOf(Immutable.List).isRequired,
    renderPoint: PropTypes.func.isRequired,
    width: PropTypes.number.isRequired,
    zoom: PropTypes.number.isRequired,
};

const defaultProps = {
    lngLatAccessor(point) {
        return point.get('location').toArray();
    },
    renderPoint: noop,
};

export default class ClickablePointsOverlay extends Component {

    @autobind
    onClickPoint(point, event) {
        event.stopPropagation();
        this.props.onClickPoint(point);
    }

    render() {
        const { points, width, height } = this.props;
        const mercator = viewportMercator(this.props);

        return (
            <svg
                height={height}
                ref={(ref) => { this.container = ref; }}
                style={{
                    left: 0,
                    position: 'absolute',
                    pointerEvents: 'all',
                    top: 0,
                }}
                width={width}
            >
                <g style={{ cursor: 'pointer' }}>
                    {
                        points.map((point, index) => {
                            const pixel = mercator.project(this.props.lngLatAccessor(point));

                            return (
                                <g
                                    key={index}
                                    /* eslint-disable react/jsx-no-bind */
                                    onClick={this.onClickPoint.bind(this, point)}
                                    /* eslint-enable react/jsx-no-bind */
                                    transform={transform([{ translate: pixel }])}
                                >
                                    {
                                        this.props.renderPoint.call(this, point, pixel)
                                    }
                                </g>
                            );
                        })
                    }
                </g>
            </svg>
        );
    }
}

ClickablePointsOverlay.propTypes = propTypes;
ClickablePointsOverlay.defaultProps = defaultProps;
