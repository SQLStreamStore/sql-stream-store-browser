import actions from '../../actions';

const url$ = actions.get.response.map(({ url }) => url);

export default url$;
