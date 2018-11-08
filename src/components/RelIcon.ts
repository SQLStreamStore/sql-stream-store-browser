import { SvgIconProps } from '@material-ui/core/SvgIcon';
import { ComponentType, createElement } from 'react';
import { rels } from 'stream-store';
import {
    ChevronLeft,
    ChevronRight,
    DeleteForever,
    FirstPage,
    Help,
    LastPage,
    List,
    Publish,
    Refresh,
    RssFeed,
    Search,
    Settings,
    SqlStreamStore,
} from './Icons';

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

interface RelIconProps {
    rel: string;
}

const RelIcon: ComponentType<RelIconProps & SvgIconProps> = ({
    rel,
    ...props
}) => createElement(fontIconByRel[rel] || SqlStreamStore, props);

export default RelIcon;
