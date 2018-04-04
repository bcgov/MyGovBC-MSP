module.exports = {
    errorModelTitle:'This image was not uploaded',
    /*
     WrongType,
     TooSmall,
     TooBig,
     AlreadyExists,
     Unknown,
     CannotOpen,
     PDFnotSupported
     */
    imageError: [
        'This image is the wrong type, only JPEG, PNG, GIF, BMP are supported',
        'This image is too small.  Please upload a larger image',
        'This image is too large. It is greater then 1.2 Megabytes after compression.',
        'You have already uploaded this image',
        'Unknown error, try uploading the file again or if the problem persists contact help',
        'Cannot read this image. This image is likely an invalid image file or you don\'t have permission to read it.' +
        '  Please refresh your browser once you close this dialog.',
        'Please submit a JPG, PNG, GIF or BMP file (not a PDF)'
    ]
}
