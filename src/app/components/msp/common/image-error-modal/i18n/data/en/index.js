module.exports = {
    errorModelTitle:'This image was not uploaded',
    /*
     WrongType,
     TooSmall,
     TooBig,
     AlreadyExists,
     Unknown
     */
    imageError: [
        'This image is the wrong type, only JPEG, PNG, GIF, BMP are supported',
        'This image is too small.  Images must be at least {width} pixels wide and {height} pixel high.',
        'This image is too large. It is greater then 2 Megabytes after compression.',
        'You have already uploaded this image',
        'Unknown error, try uploading the file again or if the problem persists contact help'
    ]
}
