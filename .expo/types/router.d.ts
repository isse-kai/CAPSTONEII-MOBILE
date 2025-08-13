/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams: { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `/login/login`; params?: Router.UnknownInputParams; } | { pathname: `/role/role`; params?: Router.UnknownInputParams; } | { pathname: `/signup/client`; params?: Router.UnknownInputParams; } | { pathname: `/signup/signup`; params?: Router.UnknownInputParams; } | { pathname: `/signup/worker`; params?: Router.UnknownInputParams; };
      hrefOutputParams: { pathname: Router.RelativePathString, params?: Router.UnknownOutputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownOutputParams } | { pathname: `/`; params?: Router.UnknownOutputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams; } | { pathname: `/login/login`; params?: Router.UnknownOutputParams; } | { pathname: `/role/role`; params?: Router.UnknownOutputParams; } | { pathname: `/signup/client`; params?: Router.UnknownOutputParams; } | { pathname: `/signup/signup`; params?: Router.UnknownOutputParams; } | { pathname: `/signup/worker`; params?: Router.UnknownOutputParams; };
      href: Router.RelativePathString | Router.ExternalPathString | `/${`?${string}` | `#${string}` | ''}` | `/_sitemap${`?${string}` | `#${string}` | ''}` | `/login/login${`?${string}` | `#${string}` | ''}` | `/role/role${`?${string}` | `#${string}` | ''}` | `/signup/client${`?${string}` | `#${string}` | ''}` | `/signup/signup${`?${string}` | `#${string}` | ''}` | `/signup/worker${`?${string}` | `#${string}` | ''}` | { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `/login/login`; params?: Router.UnknownInputParams; } | { pathname: `/role/role`; params?: Router.UnknownInputParams; } | { pathname: `/signup/client`; params?: Router.UnknownInputParams; } | { pathname: `/signup/signup`; params?: Router.UnknownInputParams; } | { pathname: `/signup/worker`; params?: Router.UnknownInputParams; };
    }
  }
}
