import { Card, CardActions } from '@material-ui/core';
import { JSONSchema7 } from 'json-schema';
import React, { ComponentType } from 'react';
import { connect, createState } from 'reactive';
import { of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';
import { navigation, rels, store } from 'stream-store';
import { FormActions, HalLinks, HalResource } from 'types';
import FormButton from './FormButton';
import LinkButton from './LinkButton';

const isNotSelf = (rel: string, links: HalLinks): boolean =>
    links[rels.self] && links[rel][0].href !== links[rels.self][0].href;

interface HyperMediaControlsState {
    href: string;
}

const state$ = createState<HyperMediaControlsState>(
    store.hal$.url$.pipe(map(href => ['href', () => href])),
    observableOf<HyperMediaControlsState>({ href: '' }),
);

interface HyperMediaControlsProps {
    actions: FormActions;
    _links: HalLinks;
    forms: { [rel: string]: HalResource & JSONSchema7 };
}

const HyperMediaControls: ComponentType<
    HyperMediaControlsProps & HyperMediaControlsState
> = ({ actions, forms, href, _links }) => (
    <Card>
        <CardActions>
            <div>
                {Object.keys(_links)
                    .filter(rel => !navigation.has(rel))
                    .filter(rel => isNotSelf(rel, _links))
                    .map(rel => (
                        <LinkButton
                            key={rel}
                            rel={rel}
                            link={_links[rel][0]}
                            color={'primary'}
                            curies={_links[rels.curies]}
                        />
                    ))}
                {Object.keys(forms).map(rel => (
                    <FormButton
                        key={rel}
                        rel={rel}
                        link={{ href }}
                        actions={actions}
                        schema={forms[rel]}
                        curies={_links[rels.curies]}
                    />
                ))}
            </div>
        </CardActions>
    </Card>
);

export default connect<HyperMediaControlsState, HyperMediaControlsProps>(
    state$,
)(HyperMediaControls);
