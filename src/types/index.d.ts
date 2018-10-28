export interface HalLink {
    readonly href: string;
    readonly title?: string;
    readonly type?: string;
    readonly templated?: boolean;
    readonly deprecation?: string;
    readonly hreflang?: string;
    readonly name?: string;
    readonly rel?: string;
}

export interface HalLinks {
    [rel: string]: HalLink[];
}

export interface EmbeddedResources {
    [rel: string]: HalResource[];
}

export interface HalResource {
    readonly _links: HalLinks;
    readonly _embedded: EmbeddedResources;
    [key: string]: any;
}

export type NavigationHandler = (link: HalLink, authorization?: string) => void;

export interface NavigatableProps {
    onNavigate: NavigationHandler;
    authorization?: string;
}

export interface HttpResponse {
    body: object | undefined | string;
    headers: { [key: string]: string };
    ok: boolean;
    status: number;
    statusText: string;
    url: string;
}

export interface HttpProblemDetailsResponse extends HttpResponse {
    body: {
        detail?: any;
        title: string;
        type: string;
    };
}

export interface HttpRequest {
    body?: object;
    link: HalLink;
    headers: { [key: string]: string | undefined };
}
