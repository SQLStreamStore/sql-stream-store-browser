import React from 'react';
import { StreamMessage, mount } from '../components';
import { getServerUrl, getStreamId, getStreamVersion } from '../utils';

export default StreamMessage(({ location, params }) => 
    `${getServerUrl(location)}/streams/${getStreamId(params)}/${getStreamVersion(params)}`);