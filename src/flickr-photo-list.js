import fetch from 'isomorphic-fetch';
import Immutable from 'immutable';
import justifiedLayout from 'justified-layout';
import React from 'react';

import config from './config';

const propTypes = {
    tag: React.PropTypes.string,
    width: React.PropTypes.number.isRequired,
};

const defaultProps = {};

const styles = {
    ul: {
        listStyleType: 'none',
        margin: 0,
        position: 'relative',
    },
    li: {},
};

export default class FlickrPhotoList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            draggedPointKey: null,
            photos: [],
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.tag && this.props.tag !== nextProps.tag) {
            this.fetchPhotos(nextProps.tag);
        }
    }

    fetchPhotos(tag) {
        return fetch(`https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${config.FLICKR_API_KEY}&user_id=${config.FLICKR_USER_ID}&tags=${tag}&sort=date-taken-asc&format=json&nojsoncallback=1&extras=url_m`)
            .then(response => response.json())
            .then((response) => {
                if (response.stat !== 'ok') {
                    throw response;
                }

                const photos = [];

                response.photos.photo.forEach((photo) => {
                    photos.push({
                        height: Number(photo.height_m),
                        id: photo.id,
                        src: photo.url_m,
                        title: photo.title,
                        width: Number(photo.width_m),
                    });
                });

                const layout = justifiedLayout(photos, {
                    containerPadding: 0,
                    containerWidth: this.props.width,
                });

                layout.boxes.forEach((box, i) => {
                    const style = box;

                    delete style.aspectRatio;

                    photos[i].style = style;
                });

                this.setState({
                    photos: Immutable.fromJS(photos),
                });
            })
            .catch(() => {
                // console.error(error);
            });
    }

    render() {
        return (
            <ul style={styles.ul}>
                {
                    this.state.photos.map(photo =>
                        <li
                            key={photo.get('id')}
                            style={styles.li}
                        >
                            <img
                                alt={photo.get('title')}
                                key={photo.get('id')}
                                src={photo.get('src')}
                                style={{
                                    ...photo.get('style').toObject(),
                                    position: 'absolute',
                                }}
                            />
                        </li>,
                    )
                }
            </ul>
        );
    }
}

FlickrPhotoList.propTypes = propTypes;
FlickrPhotoList.defaultProps = defaultProps;
