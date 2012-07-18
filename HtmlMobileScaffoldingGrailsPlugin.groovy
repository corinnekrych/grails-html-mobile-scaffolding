import org.grails.html.mobile.JavascriptDateRegistrar

class HtmlMobileScaffoldingGrailsPlugin {

    def version = '1.0-SNAPSHOT'
    def grailsVersion = '2.0 > *'
    def dependsOn = [:]
    def pluginExcludes = []

    def title = 'Html Mobile Scaffolding Plugin'
    def developers = [
      [ name: "Corinne Krych", email: "corinnekrych@gmail.com" ],
      [ name: "Fabrice Matrat", email: "fabricematrat@gmail.com" ],
      [ name: "Sebastien Blanc", email: "scm.blanc@gmail.com" ]
    ]

    def description = '''
A plugin that scaffold HTML5 mobile application using JQuery mobile in one-page. No GSP anymore.
'''

    def documentation = 'http://..'
    def license = 'MIT'
    def issueManagement = [system: 'GitHub', url: 'https://github.com/..../issues']
    def scm = [url: 'https://github.com/...']
    
    
    def doWithSpring = {
      customPropertyEditorRegistrar(JavascriptDateRegistrar)
  }
}
