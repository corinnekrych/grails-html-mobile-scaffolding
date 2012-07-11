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
	var div = \$("#form-update-${classNameLowerCase}");
	var inputs = div.find("input");
	\$.each(inputs, function (index, element) {
		\$(element).val("");
	});
	\$("#delete-${classNameLowerCase}").hide();
}

function show${className}(id) {
	var ${classNameLowerCase} = \$("#section-${classNameLowerCase}s").data("${className}_" + id);
    <%  excludedProps = Event.allEvents.toList() << 'id' << 'version'
    allowedNames = domainClass.persistentProperties*.name << 'dateCreated' << 'lastUpdated'
    props = domainClass.properties.findAll { allowedNames.contains(it.name) && !excludedProps.contains(it.name) && it.type != null && !Collection.isAssignableFrom(it.type) }
    Collections.sort(props, comparator.constructors[0].newInstance([domainClass] as Object[]))
    props.eachWithIndex { p, i ->
    if (i < 6) {
       %>
	\$('#input-${classNameLowerCase}-${p.name}').val(${classNameLowerCase}.${p.name});
	\$('#field-${classNameLowerCase}-${p.name}').fieldcontain('refresh');
    <%  } }  %>
	\$('#input-${classNameLowerCase}-id').val(${classNameLowerCase}.id);
	\$('#field-${classNameLowerCase}-id').fieldcontain('refresh');
	\$('#input-${classNameLowerCase}-version').val(${classNameLowerCase}.version);
	\$('#field-${classNameLowerCase}-version').fieldcontain('refresh');
	\$('#input-${classNameLowerCase}-class').val(${classNameLowerCase}.class);
	\$('#field-${classNameLowerCase}-class').fieldcontain('refresh');
	\$("#delete-${classNameLowerCase}").show();
}

${className}.prototype.renderToHtml = function() {
};

function serializeObject(inputs) {
	var arrayData, objectData;
	arrayData = inputs;
	objectData = {};

	\$.each(arrayData, function() {
		var value;

		if (this.value != null) {
			value = this.value;
		} else {
			value = '';
		}

		if (objectData[this.name] != null) {
			if (!objectData[this.name].push) {
				objectData[this.name] = [ objectData[this.name] ];
			}

			objectData[this.name].push(value);
		} else {
			objectData[this.name] = value;
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