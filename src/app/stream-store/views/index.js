import Home from './Home';
import Stream from './Stream';
import StreamMessage from './StreamMessage';
import StreamMetadata from './StreamMetadata';
import rels from '../rels';

export default {
    [rels.feed]: Stream,
    [rels.message]: StreamMessage,
    [rels.index]: Home,
    [rels.metadata]: StreamMetadata,
};
