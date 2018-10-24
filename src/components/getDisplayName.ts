import { ComponentType } from 'react';

export default <T>(
    hocName: string,
    WrappedComponent: ComponentType<T>,
): string =>
    `${hocName}(${WrappedComponent.displayName ||
        WrappedComponent.name ||
        'Component'})`;
