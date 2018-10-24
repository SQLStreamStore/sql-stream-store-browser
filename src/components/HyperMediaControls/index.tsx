import { Card, CardActions } from '@material-ui/core';
import React, { StatelessComponent } from 'react';
import { connect, createState } from '../../reactive';
import { navigation, rels, store } from '../../stream-store';
import { HalLinks } from '../../types';
import FormButton from './FormButton';
import LinkButton from './LinkButton';

const isNotSelf = (rel: string, links: HalLinks): boolean =>
    links[rels.self] && links[rel][0].href !== links[rels.self][0].href;

const state$ = createState(store.url$.map(href => ['href', () => href]));

interface HyperMediaControlsProps {
    actions: any;
    href: string;
    links: HalLinks;
    forms: { [rel: string]: any };
}

const HyperMediaControls: StatelessComponent<HyperMediaControlsProps> = ({
    forms,
    href,
    actions,
    links,
}) => (
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

export default connect(state$)(HyperMediaControls);
