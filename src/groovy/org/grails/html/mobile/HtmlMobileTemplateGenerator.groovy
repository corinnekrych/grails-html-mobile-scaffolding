package org.grails.html.mobile
import java.io.Writer;
import org.codehaus.groovy.grails.commons.GrailsDomainClass;
import org.codehaus.groovy.grails.scaffolding.DefaultGrailsTemplateGenerator;
import org.apache.commons.logging.Log
import org.apache.commons.logging.LogFactory
import org.codehaus.groovy.grails.commons.GrailsApplication
import org.codehaus.groovy.grails.commons.GrailsDomainClass
import org.codehaus.groovy.grails.plugins.GrailsPluginManager
import org.codehaus.groovy.grails.plugins.PluginManagerAware
import org.springframework.context.ResourceLoaderAware
import org.springframework.core.io.ClassPathResource
import org.springframework.core.io.FileSystemResource
import org.springframework.core.io.ResourceLoader
import org.springframework.core.io.support.PathMatchingResourcePatternResolver
import org.springframework.util.Assert
import org.springframework.core.io.AbstractResource

class HtmlMobileTemplateGenerator extends DefaultGrailsTemplateGenerator {

 def event

 HtmlMobileTemplateGenerator(ClassLoader classLoader) {
   super(classLoader)
 }

 @Override
 void generateViews(GrailsDomainClass domainClass, String destdir) {
   Assert.hasText destdir, 'Argument [destdir] not specified'

   for (t in getTemplateNames()) {
     event 'StatusUpdate', ["Generating $t for domain class ${domainClass.fullName}"]
     generateView domainClass, t, new File(destdir).absolutePath
   }
 }

 @Override
 void generateView(GrailsDomainClass domainClass, String viewName, Writer out) {
   def templateText = getTemplateText(viewName)
   if (templateText) {

     def t = engine.createTemplate(templateText)
     def multiPart = domainClass.properties.find {it.type == ([] as Byte[]).class || it.type == ([] as byte[]).class}

     boolean hasHibernate = pluginManager?.hasGrailsPlugin('hibernate')
     def packageName = domainClass.packageName ? "<%@ page import=\"${domainClass.fullName}\" %>" : ""
     def project = this.grailsApplication.metadata['app.name']
     
     def excludedProps = Event.allEvents.toList() << 'id' << 'version'
     def allowedNames = domainClass.persistentProperties*.name << 'dateCreated' << 'lastUpdated'
     def props = domainClass.properties.findAll { allowedNames.contains(it.name) && !excludedProps.contains(it.name) && it.type != null && !Collection.isAssignableFrom(it.type) }
     def oneToManyProps = props.findAll { it.isOneToOne() }
     //oneToManyProps.each {println it.name}
     def binding = [pluginManager: pluginManager,
       project: project,
       packageName: packageName,
       domainClass: domainClass,
       props: props,
       oneToManyProps: oneToManyProps,
       className: domainClass.shortName]

     t.make(binding).writeTo(out)
   }
 }

 @Override
 void generateView(GrailsDomainClass domainClass, String viewName, String destDir) {
   def suffix = viewName.find(/\.\w+$/)

   def viewsDir
   if (suffix == '.html') {
     viewsDir = new File("$destDir/web-app")
   } else if (suffix == '.js') {
     viewsDir = new File("$destDir/web-app/js")
   }
   if (!viewsDir.exists()) viewsDir.mkdirs()

   def destFile = new File(viewsDir, "${domainClass.propertyName.toLowerCase()}-${viewName.toLowerCase()}")
   destFile.withWriter { Writer writer ->
     generateView domainClass, viewName, writer
   }
 }

 @Override
 def getTemplateNames() {
   def resources = []
   def resolver = new PathMatchingResourcePatternResolver()
   def templatesDirPath = "${basedir}/src/templates/scaffolding"
   def templatesDir = new FileSystemResource(templatesDirPath)
   if (templatesDir.exists()) {
     try {
       resources.addAll(resolver.getResources("file:$templatesDirPath/*.html").filename)
       resources.addAll(resolver.getResources("file:$templatesDirPath/*.js").filename)
     } catch (e) {
       event 'StatusError', ['Error while loading views from grails-app scaffolding folder', e]
     }
   }
   resources
 }

 private String getPropertyName(GrailsDomainClass domainClass) { "${domainClass.propertyName}${domainSuffix}" }

}
