import React from 'react';
import { Card, CardActions } from '@material-ui/core';
import { connect, createState } from '../../reactive';
import { navigation, store } from '../../stream-store';
import LinkButton from './LinkButton';
import FormButton from './FormButton';
import { rels } from '../../stream-store';

const isNotSelf = (rel, links) =>
    links[rels.self] && links[rel][0].href !== links[rels.self][0].href;

const state$ = createState(store.url$.map(href => ['href', () => href]));

const HyperMediaControls = ({ forms, href, actions, links, onNavigate }) => (
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
                            onNavigate={onNavigate}
                            color={'active'}
                            curies={links[rels.curies]}
                        />
                    ))}
            </div>
            <div>
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
