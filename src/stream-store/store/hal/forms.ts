import { JSONSchema7 } from 'json-schema';
import { map } from 'rxjs/operators';
import { HalResource } from 'types';
import body$ from './body';

const isJsonSchema = (schema: JSONSchema7 & HalResource) =>
    schema && schema.$schema && schema.$schema.endsWith('schema#');

const forms$ = body$.pipe(
    map(({ _embedded }) => _embedded),
    map(embedded =>
        Object.keys(embedded)
            .filter(rel => isJsonSchema(embedded[rel][0]))
            .reduce(
                (akk, rel) => ({
                    ...akk,
                    [rel]: embedded[rel][0],
                }),
                // tslint:disable-next-line:no-object-literal-type-assertion
                {} as JSONSchema7,
            ),
    ),
);

export default forms$;
