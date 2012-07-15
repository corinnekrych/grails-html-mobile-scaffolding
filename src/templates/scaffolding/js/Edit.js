<% import grails.persistence.Event %>
<% classNameLowerCase = className.toLowerCase() %>
function ${className}() {
	this.${classNameLowerCase} = [];
}

\$('#section-show-${classNameLowerCase}').live('pageshow', function(e) {
	var url = \$(e.target).attr("data-url");
	var matches = url.match(/\\?id=(.*)/);
	if (matches != null) {
		show${className}(matches[1]);
	} else {
		create${className}();
	}
});

function create${className}() {
	resetForm("form-update-${classNameLowerCase}");
    <%  excludedProps = Event.allEvents.toList() << 'id' << 'version'
    allowedNames = domainClass.persistentProperties*.name << 'dateCreated' << 'lastUpdated'
    props = domainClass.properties.findAll { allowedNames.contains(it.name) && !excludedProps.contains(it.name) && it.type != null && !Collection.isAssignableFrom(it.type) }
    Collections.sort(props, comparator.constructors[0].newInstance([domainClass] as Object[]))
    props.eachWithIndex { p, i ->
    if (p.isEnum()) { %>	
	\$('input[name="${p.name}"]:first').prop('checked', true);
	\$('input[name="${p.name}"]:first').checkboxradio('refresh');
    <%  }  }%>	
	\$("#delete-${classNameLowerCase}").hide();
}

function show${className}(id) {
	resetForm("form-update-${classNameLowerCase}");
	var ${classNameLowerCase} = \$("#section-${classNameLowerCase}s").data("${className}_" + id);
    <%  excludedProps = Event.allEvents.toList() << 'id' << 'version'
    allowedNames = domainClass.persistentProperties*.name << 'dateCreated' << 'lastUpdated'
    props = domainClass.properties.findAll { allowedNames.contains(it.name) && !excludedProps.contains(it.name) && it.type != null && !Collection.isAssignableFrom(it.type) }
    Collections.sort(props, comparator.constructors[0].newInstance([domainClass] as Object[]))
    props.eachWithIndex { p, i ->
    if (p.type == Boolean || p.type == boolean) { %>
	\$('#input-${classNameLowerCase}-${p.name}').prop('checked', ${classNameLowerCase}.${p.name});
	\$('#input-${classNameLowerCase}-${p.name}').checkboxradio('refresh');
    <%  } else if (p.isEnum()) {%>
	\$('#input-${classNameLowerCase}-${p.name}-' + ${classNameLowerCase}.${p.name}.name).prop('checked', true);
	\$('#input-${classNameLowerCase}-${p.name}-' + ${classNameLowerCase}.${p.name}.name).checkboxradio('refresh');
    <%  } else  {%>
	\$('#input-${classNameLowerCase}-${p.name}').val(${classNameLowerCase}.${p.name});
    <%  }  }%>
	\$('#input-${classNameLowerCase}-id').val(${classNameLowerCase}.id);
	\$('#input-${classNameLowerCase}-version').val(${classNameLowerCase}.version);
	\$('#input-${classNameLowerCase}-class').val(${classNameLowerCase}.class);
	\$("#delete-${classNameLowerCase}").show();
}

${className}.prototype.renderToHtml = function() {
};

function resetForm(form) {
	var div = \$("#" + form);
	div.find('input:text, input:hidden, input:password').val('');
	div.find('input:radio, input:checkbox').removeAttr('checked').removeAttr('selected').checkboxradio('refresh');
}

function serializeObject(inputs) {
	var arrayData, objectData;
	arrayData = inputs;
	objectData = {};

	\$.each(arrayData, function() {
		var value, classtype;
		var add = true;

		if (this.type == 'radio') {
			if (\$(this).is(':checked')) {
				value = this.value;
			} else {
				add = false;
			}
		} else if (this.type == 'checkbox') {
			value = this.checked;
		} else {
			if (this.value != null) {
				value = this.value;
			} else {
				value = '';
			}
		}

		if (add) {
			if (objectData[this.name] != null) {
				if (!objectData[this.name].push) {
					objectData[this.name] = [ objectData[this.name] ];
				}

				objectData[this.name].push(value);
			} else {
				objectData[this.name] = value;
			}
		}
	});

	return objectData;
}


\$("#submit-${classNameLowerCase}").live("click tap", function() {
	var div = \$("#form-update-${classNameLowerCase}");
	var inputs = div.find("input");
	var obj = serializeObject(inputs);
	var action = "update";
	if (obj.id == "") {
		action= "save";
	}
	var txt = {
		${classNameLowerCase} : JSON.stringify(obj)
	};

	\$.ajax({
		cache : false,
		type : "POST",
		async : false,
		data : txt,
		dataType : "jsonp",
		url : serverUrl + '/${classNameLowerCase}/' + action,
		success : function(data) {
			if (action == "save") {
				add${className}OnSection(data);
				\$('#list-${classNameLowerCase}s').listview('refresh');
			} else {
				var ${classNameLowerCase} = \$("#section-${classNameLowerCase}s").data('${className}_' + data.id);
				\$(${classNameLowerCase}).trigger("refresh-${classNameLowerCase}"+ data.id + "-list", data);
			}
		},
		error : function(xhr) {
			alert(xhr.responseText);
		}
	});

});


\$("#delete-${classNameLowerCase}").live("click tap", function() {
	var ${classNameLowerCase}Id = \$('#input-${classNameLowerCase}-id').val();
	var txt = { id : ${classNameLowerCase}Id };
	\$.ajax({
		cache : false,
		type : "POST",
		async : false,
		data : txt,
		dataType : "jsonp",
		url : serverUrl + '/${classNameLowerCase}/delete',
		success : function(data) {
			remove${className}OnSection(data.id);
		},
		error : function(xhr) {
			alert(xhr.responseText);
		}
	});
});