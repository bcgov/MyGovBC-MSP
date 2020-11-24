const fs = require('fs');
/* tslint:disable */

// This files is called in the npm pre-build hooks. It creates a generated
// version file which can be loaded by app.component.ts to log out.

// It is important that this file is written in pure node-compatible JS so it
// can run on Jenkins. However the generated file is a .ts as it's consumed by
// Angular in app.component.ts.

// To update project version, use npm version patch/minor/major
// https://docs.npmjs.com/cli/version
const { version: projectVersion } = require('../package.json');

require('child_process').exec('git rev-parse --short HEAD', function(err, stdout) {
    console.log('Last commit hash on this branch is:', stdout);
    const trimmed = stdout.replace("\n", '');
    const time = new Date();
    const timezone = {timeZone: "America/Vancouver"};
    const buildTime = `${ time.toLocaleDateString('en-CA', timezone) } at ${time.toLocaleTimeString('en-CA', timezone) }`;

    // Checking we have a realistic response
    let success = false;
    let content;
    if (trimmed.length && buildTime.length && projectVersion.length) {
        success = true;
    }

    if (success) {
    // Unindent so the generated file is unintended too.
content = `// DO NOT DELETE OR APP WILL FAIL TO COMPILE! Generated from version.js
export const gitCommit = '${trimmed}';
export const buildTime = '${ buildTime }';
/** App version retrieved from package.json. */
export const projectVersion = '${projectVersion}';
/** Human readable message  */
export const message = 'Canonical Version: ${ trimmed } - ${ buildTime } (v${projectVersion}) \\nhttps://github.com/bcgov/MyGovBC-MSP/commits/${ trimmed }';
/** If true, other values should be present. */
export const success = ${success};
`
    } else {
content = `//DO NOT DELETE OR APP WILL FAIL TO COMPILE! Generated from version.js
// SOMETHING HAS GONE WRONG AND VERSION WAS NOT GENERATED SUCCESSFULLY
export const success = ${success};
export const message = 'Version error. Unable to generate version.'`
    }

    fs.writeFileSync(
        __dirname + '/version.GENERATED.ts',
        content,
        {encoding: 'utf8'}
    )
});
