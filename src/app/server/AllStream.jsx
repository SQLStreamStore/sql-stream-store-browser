import React from 'react';
import { Stream, mount } from '../components';
import { getServerUrl } from '../utils';

export default Stream(({ location }) => `${getServerUrl(location)}/stream`);