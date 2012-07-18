import grails.util.GrailsNameUtils
import org.codehaus.groovy.grails.commons.GrailsDomainClass
import org.springframework.core.io.FileSystemResource
import org.springframework.core.io.support.PathMatchingResourcePatternResolver
import org.springframework.util.Assert
import org.codehaus.groovy.grails.scaffolding.*
import grails.persistence.Event

includeTargets << grailsScript("_GrailsCreateArtifacts")
includeTargets << grailsScript("_GrailsGenerate")
includeTargets << grailsScript("_GrailsBootstrap")

generateForName = null

target(generateForOne: 'Generates controllers and views for only one domain class.') {
  depends compile, loadApp

  def name = generateForName
  //grailsConsole.updateStatus "name $name "

  name = name.indexOf('.') > 0 ? name : GrailsNameUtils.getClassNameRepresentation(name)
  //grailsConsole.updateStatus "name $name "

  def domainClass = grailsApp.getDomainClass(name)
  //grailsConsole.updateStatus "domain $domainClass "

  if (!domainClass) {
    grailsConsole.updateStatus 'Domain class not found in grails-app/domain, trying hibernate mapped classes...'
    bootstrap()
    domainClass = grailsApp.getDomainClass(name)
  }

  if (domainClass) {
    generateForDomainClass(domainClass)
    event 'StatusFinal', [
      "Finished generation for domain class ${domainClass.fullName}"
    ]
  }
  else {
    event 'StatusFinal', [
      "No domain class found for name ${name}. Please try again and enter a valid domain class name"
    ]
    exit 1
  }
}

def generateForDomainClass(domainClass) {
  def templateGenerator = new HtmlMobileTemplateGenerator(classLoader)
  templateGenerator.grailsApplication = grailsApp
  templateGenerator.pluginManager = pluginManager
  templateGenerator.event = event

  //event 'StatusUpdate', ["Generating views for domain class ${domainClass.fullName}"]
  templateGenerator.generateViews(domainClass, basedir)
  //event 'GenerateViewsEnd', [domainClass.fullName]


  //		event 'StatusUpdate', ["Generating controller for domain class ${domainClass.fullName}"]
  templateGenerator.generateController(domainClass, basedir)
  //		event 'GenerateControllerEnd', [domainClass.fullName]
}

