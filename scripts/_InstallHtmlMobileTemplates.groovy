includeTargets << grailsScript("_GrailsInit")

target(htmlMobileCopyTemplates: "generate one HTML view with different section for CRUD") {
  depends checkVersion, parseArguments
  
  //event 'InstallTemplatesStart', ['Installing HTML Mobile Templates...']

  def tagetPaths = [js: "$basedir/src/templates/scaffolding", html: "$basedir/src/templates/scaffolding", groovy: "$basedir/src/templates/scaffolding"]

  def overwrite = false
  
  if (tagetPaths.any { new File(it.value).exists() }) {
    if (!isInteractive || confirmInput('Overwrite existing templates?', 'overwrite.templates')) {
      overwrite = true
    }
  }

  tagetPaths.each { sourcePath, targetDir ->
    def sourceDir = "$htmlMobileScaffoldingPluginDir/src/templates/scaffolding/$sourcePath"

    ant.mkdir dir: targetDir
    //event 'StatusUpdate', ["Copying files to $targetDir..."]
    ant.copy(todir: targetDir, overwrite: overwrite) {
      fileset dir: sourceDir
    }

    //event 'StatusUpdate', ['Templates for HTML Mobile installed successfully']
  }

  //event 'InstallTemplatesEnd', ['Finished Installing Templates']
}

