import flatMap from 'array.prototype.flatmap';
import React from 'react';
import ReactDOM from 'react-dom';
import SqlStreamStoreBrowser from './SqlStreamStoreBrowser';

declare global {
    interface Window {
        React: typeof React;
        ReactDOM: typeof ReactDOM;
        SqlStreamStoreBrowser: typeof SqlStreamStoreBrowser;
    }
}

flatMap.shim();

window.SqlStreamStoreBrowser = SqlStreamStoreBrowser;
window.ReactDOM = ReactDOM;
window.React = React;

export default SqlStreamStoreBrowser;
