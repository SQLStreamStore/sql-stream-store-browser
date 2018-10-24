import React from 'react';
import ReactDOM from 'react-dom';
import SqlStreamStoreBrowser from './SqlStreamStoreBrowser';

const anyWindow = window as any;
anyWindow.SqlStreamStoreBrowser = SqlStreamStoreBrowser;
anyWindow.ReactDOM = ReactDOM;
anyWindow.React = React;

export default SqlStreamStoreBrowser;
