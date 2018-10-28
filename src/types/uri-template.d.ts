declare module 'uri-template' {
    export interface UriTemplate {
        expressions: any[];
        expand(params: object): string;
    }

    export interface UriTemplateParser {
        parse(template: string): UriTemplate;
    }

    const parser: UriTemplateParser;

    export default parser;
}
