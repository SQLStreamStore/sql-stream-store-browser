export interface HalLink {
    readonly href: string;
    readonly title?: string;
    readonly type?: string;
    readonly templated?: boolean;
    readonly deprecation?: string;
    readonly hreflang?: string;
    readonly name?: string;
}

export interface HalLinks {
    [rel: string]: HalLink[];
}

export interface HalResource {
    readonly _links?: HalLinks;
    readonly _embedded?: EmbeddedResources;
}

export interface EmbeddedResources {
    [rel: string]: HalResource | HalResource[];
}

export interface NavigatableProps {
    onNavigate: (link: HalLink, authorization?: string) => void;
    authorization?: string;
}
