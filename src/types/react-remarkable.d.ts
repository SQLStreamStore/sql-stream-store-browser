declare module 'react-remarkable' {
    import { ComponentType, ReactNode } from 'react';
    import { Options } from 'remarkable';

    interface RemarkableProps {
        children?: ReactNode;
        options?: Options;
    }

    const Remarkable: ComponentType<RemarkableProps>;

    export default Remarkable;
}
