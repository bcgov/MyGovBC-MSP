import { SimpleDate } from 'moh-common-lib';
import * as moment from 'moment';

/**
 * Helper functions for SimpleDate interface.
 *
 * @param {SimpleDate} date
 * @returns custom object with helper functions
 */
export function SimpleDateTools(date: SimpleDate) {
    const _date: SimpleDate = date;

    /**
     * Converts a SimpleDate to a Moment. From there, you can call any method
     * found found in Moment.
     *
     * @example
     * ```
     * SimpleDateTools({year: 1991, month: 6, day: 11})
     * .toMoment().format("MMMM Do, YYYY")
     * >>> "June 11th, 19991"
     * ```
     *
     * @returns {moment.Moment}
     */
    function toMoment(): moment.Moment {
        return moment({
            year: _date.year,
            month: _date.month - 1, // moment use 0 index for month :(
            day: _date.day,
        });
    }

    /**
     * A simple alias for Moment.format.  This is **identical** to calling
     *
     * ```
     * SimpleDateTools(obj).toMoment().format(strFormat)
     * ```
     *
     * @param {string} strFormat
     * @returns {string}
     */
    function format(strFormat: string): string{
        return toMoment().format(strFormat);
    }

    return { toMoment, format };
}
