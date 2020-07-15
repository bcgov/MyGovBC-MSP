// Edit your app's name below
def APP_NAME = 'msp'

def CHAINED_ANGULAR_BUILD = 'angular-builder'

// Edit your environment TAG names below
def TAG_NAMES = ['dev', 'test', 'prod']
def TAG_NAMES_BACKUP = ['devbackup', 'testbackup', 'prodbackup']

// You shouldn't have to edit these if you're following the conventions
def NGINX_BUILD_CONFIG = 'nginx-runtime'
def BUILD_CONFIG = APP_NAME + '-build'
def IMAGESTREAM_NAME = APP_NAME 

node {

  stage('build nginx') {
    echo "Building: " + NGINX_BUILD_CONFIG
    openshiftBuild bldCfg: NGINX_BUILD_CONFIG, showBuildLogs: 'true'
  }

  stage('build chained app ' + CHAINED_ANGULAR_BUILD) {
    echo "Building Chained Angular Build: " + CHAINED_ANGULAR_BUILD
    openshiftBuild bldCfg: CHAINED_ANGULAR_BUILD, showBuildLogs: 'true'
  }

  stage('build ' + BUILD_CONFIG) {
    echo "Building: " + BUILD_CONFIG
    openshiftBuild bldCfg: BUILD_CONFIG, showBuildLogs: 'true'
    IMAGE_HASH = sh (
       script: """oc get istag ${IMAGESTREAM_NAME}:latest -o template --template=\"{{.image.dockerImageReference}}\"|awk -F \":\" \'{print \$3}\'""",
 	  returnStdout: true).trim()
    echo ">> IMAGE_HASH: $IMAGE_HASH"
  }

  stage('deploy-' + TAG_NAMES[0]) {
    echo "Deploying to: " + TAG_NAMES[0]
    openshiftTag destStream: IMAGESTREAM_NAME, verbose: 'true', destTag: TAG_NAMES[0], srcStream: IMAGESTREAM_NAME, srcTag: "${IMAGE_HASH}"
  }
}

node {
  stage('deploy-' + TAG_NAMES[1]) {
    input "Deploy to " + TAG_NAMES[1] + "?"
    echo "Deploy to " + TAG_NAMES[1] + " " + IMAGESTREAM_NAME + ":" + "${IMAGE_HASH}"
    openshiftTag destStream: IMAGESTREAM_NAME, verbose: 'true', destTag: TAG_NAMES_BACKUP[1], srcStream: IMAGESTREAM_NAME, srcTag: TAG_NAMES[1]
    openshiftTag destStream: IMAGESTREAM_NAME, verbose: 'true', destTag: TAG_NAMES[1], srcStream: IMAGESTREAM_NAME, srcTag: "${IMAGE_HASH}"
  }
}

node {
  stage('deploy-'  + TAG_NAMES[2]) {
    input "Deploy to " + TAG_NAMES[2] + "?"
    echo "Deploy to " + TAG_NAMES[2] + " " + IMAGESTREAM_NAME + ":" + "${IMAGE_HASH}"
    openshiftTag destStream: IMAGESTREAM_NAME, verbose: 'true', destTag: TAG_NAMES_BACKUP[2], srcStream: IMAGESTREAM_NAME, srcTag: TAG_NAMES[2]
    openshiftTag destStream: IMAGESTREAM_NAME, verbose: 'true', destTag: TAG_NAMES[2], srcStream: IMAGESTREAM_NAME, srcTag: "${IMAGE_HASH}"
  }
}
