// @flow

import { isBefore } from 'date-fns'
import { DateTime, Duration } from 'luxon'
import BN from 'bignumber.js'

import type { NumberString, TimeUnit } from '../flowtype/common-types'

import { timeUnits } from './constants'

const luxonTimeUnits = [
    'second',
    'minute',
    'hour',
    'day',
    'week',
    'month',
]

/**
 * Convert duration to seconds.
 * @param quantity Number of units to convert.
 * @param timeUnit Unit, e.g. day, hour, minute, etc.
 */
export const toSeconds = (quantity: NumberString | BN, timeUnit: TimeUnit): BN => {
    if (!luxonTimeUnits.includes(timeUnit)) {
        throw new Error(`Invalid price unit: ${timeUnit}`)
    }
    return BN(Duration.fromObject({
        [timeUnit]: BN(quantity).toNumber(),
    }).toFormat('s'))
}

/**
 * Returns formatted date from a timestamp.
 * @param timestamp unit expected is seconds.
 */
export const formatDateTime = (timestamp: ?number) => DateTime.fromMillis((timestamp || 0) * 1000).toFormat('yyyy-LL-dd HH:mm:ss')

/**
 * Returns short form for given time unit.
 * @param timeUnit Time unit to abbreviate.
 */
export const getAbbreviation = (timeUnit: TimeUnit) => {
    switch (timeUnit) {
        case timeUnits.second:
            return 's'
        case timeUnits.minute:
            return 'min'
        case timeUnits.hour:
            return 'hr'
        case timeUnits.day:
            return 'd'
        case timeUnits.week:
            return 'wk'
        case timeUnits.month:
            return 'm'
        default:
            return ''
    }
}

/**
 * Returns true if the given time is in the future.
 * @param time Time to check
 * If a unix timestamp is passed, use milliseconds, not seconds.
 */
export const isActive = (time: string | number | Date): boolean => isBefore(new Date(), time)
