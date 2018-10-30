declare module 'react-inspector' {
    import { ComponentType } from 'react';

    export interface ObjectNameProps {
        name: string;
        dimmed?: boolean;
    }

    export interface ObjectValueProps {
        object: any;
    }

    export interface ObjectLabelProps {
        isNonenumerable: boolean;
        name: string;
        data?: any;
    }

    export interface ObjectRootLabelProps {
        name?: any;
        data?: any;
    }

    export interface NodeRendererProps extends ObjectLabelProps {
        depth: number;
    }

    export interface ObjectInspectorProps {
        name?: string;
        data?: any;
        expandLevel: number;
        nodeRenderer(props: NodeRendererProps): JSX.Element;
    }

    export const ObjectName: ComponentType<ObjectNameProps>;
    export const ObjectValue: ComponentType<ObjectValueProps>;
    export const ObjectLabel: ComponentType<ObjectLabelProps>;
    export const ObjectRootLabel: ComponentType<ObjectRootLabelProps>;
    const Inspector: ComponentType<ObjectInspectorProps>;

    export default Inspector;
}
