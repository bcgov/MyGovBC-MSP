module.exports = {
    invalidYearPattern: 'In the year field, use a 4-digt number starting with a non-zero digit',
    birthdateLabel: 'Birthdate',
    yearLabel: 'Year',
    dayLabel: 'Day',
    monthLabel: 'Month',
    monthErrorRequired: 'Month is required',
    dayErrorRequired: 'Day is required',
    yearErrorRequired: 'Year is required',
    yearErrorBadFormat: 'This does not appear to be a valid date',
    yearErrorFutureCheck: 'Birth date can not be in the future',
    yearErrorDistantPast: 'Date is too far in the past',
    yearErrorDistantFuture: 'Date is too far in the future',
    calendarDayOutOfRange: 'Day of the month is out of range',

    /**
     *   Applicant,
     Spouse,
     ChildUnder19,
     Child19To24,
     */
    yearErrorAgeCheck: [
        'An applicant must be 16 years or older',
        '',
        'A child must be less than 19 years old',
        'A post-secondary student must be between 19 and 24 years',
        'A child/dependent post-secondary student must be less than 24 years old',
    ]
}