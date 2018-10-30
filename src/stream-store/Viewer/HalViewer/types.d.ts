import { JSONSchema7 } from 'json-schema';
import { HalLinks, HalResource } from '../../../types';

export interface HalViewerProps {
    self: string;
    _links: HalLinks;
    forms: { [rel: string]: HalResource & JSONSchema7 };
}
