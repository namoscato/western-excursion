import autobind from 'autobind-decorator';
import document from 'global/document';
import React from 'react';
import ReactDOM from 'react-dom';
import window from 'global/window';

import FlickrPhotoList from './flickr-photo-list';
import Map from './map';

const styles = {
    content: {
        height: '100%',
        overflowX: 'hidden',
        position: 'absolute',
        right: 0,
    },
    description: {
        lineHeight: 1.5,
    },
    header: {
        padding: 20,
    },
    h1: {
        fontFamily: "'Playfair Display', serif",
        fontSize: '1.5em',
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop: 0,
    },
    map: {
        position: 'fixed',
    },
};

export default class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            activeLocation: null,
            windowHeight: window.innerHeight,
            windowWidth: window.innerWidth,
        };

        window.addEventListener('resize', this.onWindowResize);
    }

    @autobind
    onClickPoint(point) {
        this.setState({
            activeLocation: point.get('properties'),
        });
    }

    @autobind
    onWindowResize() {
        this.setState({
            windowHeight: window.innerHeight,
            windowWidth: window.innerWidth,
        });
    }

    @autobind
    getActiveLocationProperty(property) {
        if (this.state.activeLocation === null) {
            return null;
        }

        return this.state.activeLocation.get(property);
    }

    render() {
        return (
            <div>
                <div style={styles.map}>
                    <Map
                        height={this.state.windowHeight}
                        onClickPoint={this.onClickPoint}
                        width={this.state.windowWidth / 2}
                    />
                </div>
                <div
                    style={{
                        ...styles.content,
                        width: this.state.windowWidth / 2,
                    }}
                >
                    <div style={styles.header}>
                        <h1 style={styles.h1}>
                            { this.getActiveLocationProperty('name') }
                        </h1>
                        <div style={styles.description}>
                            { this.getActiveLocationProperty('description') }
                        </div>
                    </div>
                    <FlickrPhotoList
                        tag={this.getActiveLocationProperty('flickrTag')}
                        width={this.state.windowWidth / 2}
                    />
                </div>
            </div>
        );
    }
}

document.body.style.margin = 0;

const reactContainer = document.createElement('div');
document.body.appendChild(reactContainer);
ReactDOM.render(<App />, reactContainer);
