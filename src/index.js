import React from 'react';
import ReactDOM from 'react-dom';
import SqlStreamStoreBrowser from './SqlStreamStoreBrowser';

if (!Array.prototype.flatMap) {
    Array.prototype.flatMap = function(selector) {
        return this.map(selector).reduce(
            (left, right) => left.concat(right),
            [],
        );
    };
}

window.SqlStreamStoreBrowser = SqlStreamStoreBrowser;
window.ReactDOM = ReactDOM;
window.React = React;

export default SqlStreamStoreBrowser;
