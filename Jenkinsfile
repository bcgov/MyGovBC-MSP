node('master') {
    stage('checkout') {
       echo "checking out source"
       echo "Build: ${BUILD_ID}"
       checkout scm
    }
	 
	stage('build') {
	 echo "Building..."
	 openshiftBuild bldCfg: "msp", showBuildLogs: 'true'
	 openshiftTag destStream: "msp", verbose: 'true', destTag: '$BUILD_ID', srcStream: "msp", srcTag: 'latest'
	 openshiftTag destStream: "msp", verbose: 'true', destTag: 'dev', srcStream: "msp", srcTag: 'latest'
    }
}


stage('deploy-test') {
  input "Deploy to test?"
  
  node('master'){
     openshiftTag destStream: 'msp', verbose: 'true', destTag: 'test', srcStream: 'msp', srcTag: '$BUILD_ID'
  }
}

stage('deploy-prod') {
  input "Deploy to prod?"
  node('master'){
     openshiftTag destStream: 'msp', verbose: 'true', destTag: 'prod', srcStream: 'msp', srcTag: '$BUILD_ID'
  }
}

