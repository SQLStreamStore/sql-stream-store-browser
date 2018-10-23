export default (hocName, WrappedComponent) =>
    `${hocName}(${WrappedComponent.displayName ||
        WrappedComponent.name ||
        'Component'})`;
