import Home from './Home.jsx';
import Stream from './Stream.jsx';
import StreamMessage from './StreamMessage.jsx';
import StreamMetadata from './StreamMetadata.jsx';
import rels from '../rels';

export default {
    [rels.feed]: Stream,
    [rels.message]: StreamMessage,
    [rels.index]: Home,
    [rels.metadata]: StreamMetadata
};