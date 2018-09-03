import React from 'react';
import { Card, CardActions } from '@material-ui/core';
import { connect, createState } from '../../reactive';
import { navigation, store } from '../../stream-store';
import LinkButton from './LinkButton';
import FormButton from './FormButton';

const state$ = createState(store.url$.map(url => ['url', () => url]));

const HyperMediaControls = ({ forms, url, actions, links, onNavigate }) => (
    <Card>
        <CardActions>
            <div>
                {Object.keys(links)
                    .filter(rel => !navigation.has(rel))
                    .map(rel => (
                        <LinkButton
                            key={rel}
                            rel={rel}
                            url={url}
                            link={links[rel]}
                            onNavigate={onNavigate}
                            color={'active'}
                        />
                    ))}
            </div>
            <div>
                {Object.keys(forms).map(rel => (
                    <FormButton
                        key={rel}
                        rel={rel}
                        url={url}
                        actions={actions}
                        schema={forms[rel]}
                    />
                ))}
            </div>
        </CardActions>
    </Card>
);

export default connect(state$)(HyperMediaControls);
