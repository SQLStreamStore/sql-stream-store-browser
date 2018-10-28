import { createElement } from 'react';
import { mediaTypes } from '../../utils';
import HalViewer from './HalViewer';
import MarkdownViewer from './MarkdownViewer';

const viewers = {
    [mediaTypes.markdown]: MarkdownViewer,
    [mediaTypes.hal]: HalViewer,
};

const Viewer = ({ mediaType, ...props }: { mediaType: string } & any) =>
    createElement(viewers[mediaType] || 'div', props);

export default Viewer;
