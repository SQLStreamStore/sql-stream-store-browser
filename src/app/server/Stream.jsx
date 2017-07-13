import React from 'react';
import { Stream, mount } from '../components';
import { getServerUrl, getStreamId } from '../utils';

export default Stream(({ location, params }) => `${getServerUrl(location)}/streams/${getStreamId(params)}`);