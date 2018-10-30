declare module 'inflector-js' {
    const inflector: {
        underscore(str: string): string;
        camel2words(str: string): string;
    };

    export default inflector;
}
