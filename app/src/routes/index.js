// @flow

import pick from 'lodash/pick'
import qs from 'query-string'
import p2r from 'path-to-regexp'

import definitions from './definitions'

type Routes = {
    [string]: (?Object) => string,
    withBasename: {
        [string]: (?Object) => string,
    }
}

type Paths = {
    [string]: string,
}

/**
 * Prepend basename.
 */
const prependBasename = (pathstr: string, includeBasename: boolean): string => (
    /^\//.test(pathstr) && includeBasename ? `${process.env.PLATFORM_BASE_PATH.replace(/\/$/, '')}${pathstr}` : pathstr
)

/**
 * Generates a route function.
 * @param pathstr Path format.
 * @param includeBasename If set, basename will be prepended to the pathname.
 * @returns Route function.
 */
export const define = (pathstr: string, includeBasename: boolean = false) => (params: ?Object): string => {
    const route = prependBasename(pathstr, includeBasename)

    if (params) {
        const tokenNames = p2r.parse(route).map((t) => t.name).filter(Boolean)
        const queryKeys = Object.keys(params).filter((key) => !tokenNames.includes(key))

        return `${p2r.compile(route)(params)}?${qs.stringify(pick(params, queryKeys))}`.replace(/\?$/, '')
    }

    return route
}

/**
 * Generates final route object.
 */
export const buildRoutes = (paths: Paths): Routes => {
    const result = {
        withBasename: {},
    }

    Object.entries(paths).forEach(([name, route]) => {
        const value: any = route

        result[name] = define(value)
        result.withBasename[name] = define(value, true)
    })

    return result
}

export default buildRoutes(definitions({
    landingPage: 'https://www.streamr.com',
}))
