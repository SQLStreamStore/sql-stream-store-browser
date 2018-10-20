import React, { createElement } from 'react';
import HalViewer from './HalViewer';
import MarkdownViewer from './MarkdownViewer';
import { mediaTypes } from '../../utils';
const viewers = {
    [mediaTypes.markdown]: MarkdownViewer,
    [mediaTypes.hal]: HalViewer,
};

const Viewer = ({ mediaType, ...props }) => {
    console.log(mediaType);
    return createElement(viewers[mediaType] || 'div', props);
};

export default Viewer;
