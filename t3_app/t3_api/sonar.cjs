const sonarqubeScanner = require('sonarqube-scanner').default;


sonarqubeScanner(
    {
        serverUrl: 'http://localhost:9007',
        token: 'sqp_87a23664b72a5adcf3d784a1bcfad640761ac466',
        options: {
            'sonar.projectKey': 't3_api',
            'sonar.sources': 'app',
            'sonar.tests': 'tests',
            'sonar.test.inclusions': 'tests/**/*.php',
            'sonar.php.tests.reportPath': 'coverage/xml/coverage.xml',       // <-- Clover XML
            'sonar.php.coverage.reportPaths': 'coverage/xml/coverage.xml',   // <-- Clover XML
            'sonar.exclusions': 'vendor/**,node_modules/**,storage/**,database/**',
        },
    },
    () => process.exit()
);
