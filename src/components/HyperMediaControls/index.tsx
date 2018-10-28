import { Card, CardActions } from '@material-ui/core';
import { JSONSchema7 } from 'json-schema';
import React, { ComponentType, StatelessComponent } from 'react';
import { Observable } from 'rxjs';
import { connect, createState } from '../../reactive';
import { navigation, rels, store } from '../../stream-store';
import { HalLinks, HalResource } from '../../types';
import FormButton from './FormButton';
import LinkButton from './LinkButton';

const isNotSelf = (rel: string, links: HalLinks): boolean =>
    links[rels.self] && links[rel][0].href !== links[rels.self][0].href;

interface HyperMediaControlsState {
    href: string;
}

const state$ = createState<HyperMediaControlsState>(
    store.hal$.url$.map(href => ['href', () => href]),
    Observable.of<HyperMediaControlsState>({ href: '' }),
);

interface HyperMediaControlsProps {
    actions: any;
    links: HalLinks;
    forms: { [rel: string]: HalResource & JSONSchema7 };
}

const HyperMediaControls: StatelessComponent<
    HyperMediaControlsProps & HyperMediaControlsState
> = ({ actions, forms, href, links }) => (
    <Card>
        <CardActions>
            <div>
                {Object.keys(links)
                    .filter(rel => !navigation.has(rel))
                    .filter(rel => isNotSelf(rel, links))
                    .map(rel => (
                        <LinkButton
                            key={rel}
                            rel={rel}
                            link={links[rel][0]}
                            color={'primary'}
                            curies={links[rels.curies]}
                        />
                    ))}
                {Object.keys(forms).map(rel => (
                    <FormButton
                        key={rel}
                        rel={rel}
                        link={{ href }}
                        actions={actions}
                        schema={forms[rel]}
                        curies={links[rels.curies]}
                    />
                ))}
            </div>
        </CardActions>
    </Card>
);

export default connect(state$)(HyperMediaControls) as ComponentType<
    HyperMediaControlsProps
>;
