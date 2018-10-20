import { createElement } from 'react';
import {
    Publish,
    Settings,
    DeleteForever,
    FirstPage,
    LastPage,
    ChevronLeft,
    ChevronRight,
    RssFeed,
    Refresh,
    Search,
    SqlStreamStore,
    List,
    Help,
} from './Icons';
import { rels } from '../stream-store';

const fontIconByRel = {
    [rels.first]: FirstPage,
    [rels.previous]: ChevronLeft,
    [rels.self]: Refresh,
    [rels.next]: ChevronRight,
    [rels.last]: LastPage,
    [rels.feed]: RssFeed,
    [rels.append]: Publish,
    [rels.metadata]: Settings,
    [rels.deleteStream]: DeleteForever,
    [rels.deleteMessage]: DeleteForever,
    [rels.find]: Search,
    [rels.browse]: List,
    [rels.curies]: Help,
};

const RelIcon = ({ rel, ...props }) =>
    createElement(fontIconByRel[rel] || SqlStreamStore, props);

export default RelIcon;
