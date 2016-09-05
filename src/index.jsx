import autobind from 'autobind-decorator';
import document from 'global/document';
import React from 'react';
import ReactDOM from 'react-dom';
import window from 'global/window';

import FlickrPhotoList from './flickr-photo-list.jsx';
import Map from './map.jsx';

const styles = {
    content: {
        height: '100%',
        overflowX: 'hidden',
        position: 'absolute',
        right: 0,
    },
    h1: {
        fontFamily: "'Playfair Display', serif",
        fontSize: '1.5em',
        fontWeight: 'bold',
        margin: 20,
    },
    map: {
        position: 'fixed',
    },
};

export default class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            activeLocationName: null,
            windowHeight: window.innerHeight,
            windowWidth: window.innerWidth,
        };

        window.addEventListener('resize', this.onWindowResize);
    }

    @autobind
    onClickPoint(point) {
        this.setState({
            activeLocationName: point.get('name'),
        });
    }

    @autobind onWindowResize() {
        this.setState({
            windowHeight: window.innerHeight,
            windowWidth: window.innerWidth,
        });
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
                    <h1 style={styles.h1}>
                        { this.state.activeLocationName }
                    </h1>
                    <FlickrPhotoList
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
