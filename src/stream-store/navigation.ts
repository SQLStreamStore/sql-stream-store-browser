import rels from './rels';

const feedNavigation = [
    'first',
    'previous',
    'self',
    'next',
    'last',
    'metadata',
    'feed',
].map(key => rels[key]);

export default new Set(feedNavigation);
