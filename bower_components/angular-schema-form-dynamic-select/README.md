[![bower version](https://img.shields.io/bower/v/angular-schema-form-dynamic-select.svg?style=flat-square)](#bower)
[![npm version](https://img.shields.io/npm/v/angular-schema-form-dynamic-select.svg?style=flat-square)](https://www.npmjs.org/package/angular-schema-form-dynamic-select)
[![Join the chat at https://gitter.im/OptimalBPM/angular-schema-form-dynamic-select](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/OptimalBPM/angular-schema-form-dynamic-select?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Angular Strap Dynamic Select add-on
===================================

The dynamic select add-on integrates the [angular-strap-select](https://github.com/mgcrea/angular-strap/tree/master/src/select) and the [angular-ui-select](https://github.com/angular-ui/ui-select) components 
 to provide fully featured drop downs to [angular-schema-form](https://github.com/Textalk/angular-schema-form). 

Note about UI-select: 
The ui-select support is quite new and still somewhat partial, and therefore:

* it is yet to support all the features below, they all apply to angular-strap-select.
* its dependencies aren't automatically installed yet.

It has a [special section in the documentation](https://github.com/OptimalBPM/angular-schema-form-dynamic-select/#ui-select).

Features:

* Static and dynamic lists
* Single and multiple select
* Convenient HTTP GET/POST and property mapping functionality
* Filters
* Sync and Async callbacks
* All callbacks referenced either by name (string) or reference
* [Angular schema form options](https://github.com/Textalk/angular-schema-form/blob/development/docs/index.md#standard-options)
  * Supported:
    * key, type, title, description, placeholder
    * enum
    * notitle, onChange, condition
    * htmlClass, labelHtmlClass and fieldHtmlClass
    * validationMessage
  * Not supported(will be added):  
    *  readonly, copyValueTo, 
  * Not applicable(will not be added due to the nature of drop downs, [disagree?](https://github.com/OptimalBPM/angular-schema-form-dynamic-select/issues)):
    * feedback
    
   

# Example

There is a live example at http://demo.optimalbpm.se/angular-schema-form-dynamic-select/ .
npm i angular-schema-form-dynamic-select
The example code is in the repository, it's the index.html, bootstrap-strapselect.js file, test/testdata.json and the test/testdata_mapped.json files.

To run it locally, simply clone the repository 
    
    git clone https://github.com/OptimalBPM/angular-schema-form-dynamic-select.git
    cd angular-schema-form-dynamic-select
    bower update

..and open index.html in a browser or serve using your favorite IDE.

(you will need to have [bower installed](http://bower.io/#install-bower), of course)



# Glossary

* List items: the items that make up the selection list, for example the items in a drop down.

# Installation

This is an add-on to the angular-schema-form. To use it (in production), just include
`angular-schema-form-dynamic-select.min.js` and satisfy its dependency.

Easiest way is to install is with bower, this will also include dependencies:

```bash
$ bower install angular-schema-form-dynamic-select
```

If you want to use the develop branch:

```bash
$ bower install angular-schema-form-dynamic-select#develop
```

\#develop is not recommended for production, but perhaps you want to use stuff from the next version in development.

You can also use npm:

```bash
$ npm i angular-schema-form-dynamic-select
```

# Usage

Usage is straightforward, simply include and reference.


Example:
 
### HTML

You'll need to load a few additional files to use the editor:



    <script type="text/javascript" src="bower_components/angular/angular.min.js"></script>
    <script src="bower_components/angular-sanitize/angular-sanitize.min.js"></script>
    <script src='bower_components/angular-strap/dist/angular-strap.min.js'></script>
    <script src='bower_components/angular-strap/dist/angular-strap.tpl.min.js'></script>
    <script src="bower_components/tv4/tv4.js"></script>
    <script src="bower_components/objectpath/lib/ObjectPath.js"></script>
    <script src="bower_components/angular-schema-form/dist/schema-form.min.js"></script>
    <script src="bower_components/angular-schema-form/dist/bootstrap-decorator.min.js"></script>
    <script src="bower_components/angular-schema-form-dynamic-select/angular-schema-form-dynamic-select.js"></script>

<i>Note: Make sure you load angular-schema-form-dynamic-select.js after loading angular schema form.</i>

### Module javascript</i>

When you create your module, be sure to make it depend on mgcrea.ngStrap as well:

    angular.module('yourModule', ['schemaForm', 'mgcrea.ngStrap']);



## Form types

The add-on contributes the following new form types, `strapselect`, `uiselect`,`uiselectmulti`.

The strapselect implements angular-strap-selects and uiselect* implements angular-ui-select.

Built-in select-controls gets the bootstrap look but retain their functionality.




## Form Definition
All settings reside in the form definition. See the [app.js](https://github.com/OptimalBPM/angular-schema-form-dynamic-select/blob/master/app.js) file for this example in use.

    $scope.form = [


### Single select from static list
The drop down items are defined by and array of value/name objects residing in the form

     {
       "key": 'select',
       "type": 'strapselect',
       "titleMap": [
          {"value": 'value1', "name": 'text1'},
          {"value": 'value2', "name": 'text2'},
          {"value": 'value3', "name": 'text3'}
        ]
     },
     
### Multiple select from static list
Like the above, but allows multiple items to be selected. 

     {
       "key": 'multiselect',
       "type": 'strapselect',
       "options": { 
        "multiple": "true"
       }
       "titleMap": [
            {"value": 'value1', "name": 'text1'},
            {"value": 'value2', "name": 'text2'},
            {"value": 'value3', "name": 'long very very long label3'}
       ]
     },
     
### Single select from dynamically loaded list via synchronous callback function
Callback must return an array of value/name objects (see static list above)
The "options" structure is passed to it as a parameter.

     {
       "key": "selectDynamic",
       "type": 'strapselect',
       "options": {
            "callback": $scope.callBackSD
       }
     },
     
### Multiple select from dynamically loaded list via synchronous callback function
Like strapselectdynamic above, but allowed multiple items to be selected.

     
     {
       "key": "multiselectDynamic",
       "type": 'strapmultiselect',
       "options": {
           "multiple": "true"
           "callback": $scope.callBackMSD
       }
     },
     
### Multiple select from asynchronous callback

The asyncCallback must return a http-style promise and the data must be a JSON array of value/name objects.
Note that in this example, the reference to the callback is a string, meaning a callback in the using controller scope.
     
     {
       "key": "multiselectDynamicAsync",
       "type": 'strapselect',
       "options": {
           "multiple": "true"
           "asyncCallback": "callBackMSDAsync"
           }
       }
     },
### Multiple select from dynamically loaded list via http get
Convenience function, makes a get request, no need for callback.
Expects the server to return a JSON array of value/name objects.
     
     {
       "key": "multiselectDynamicHttpGet",
       "type": 'strapselect',
       "options": {
           "multiple": "true"
           "httpGet": {
               "url" : "test/testdata.json"
           }
       }
     },
               
### Multiple select from dynamically loaded list via http post with an options callback
Like the get variant above function, but makes a JSON POST request passing the "parameter" as JSON.<br />
This example makes use of the optionsCallback property. 
It is a callback that like the others, gets the options structure
as a parameter, but allows its content to be modified and returned for use in the call. 
Here, the otherwise mandatory httpPost.url is not set in the options but in the callback.

See the stringOptionsCallback function in [app.js](https://github.com/OptimalBPM/angular-schema-form-dynamic-select/blob/master/app.js) for an example. 
The options-instance that is passed to the parameter is a *copy* of the instance in the form, 
so the form instance is not affected by any modifications by the callback.
     
     {
       "key": "multiselectDynamicHttpPost",
       "type": 'strapselect',
       "options": {
           "multiple": "true"
           "httpPost": {
               "optionsCallback" : "stringOptionsCallback",
               "parameter": { "myparam" : "Hello"}
           }
       }
     },


### Property mapping
The angular-schema-form titleMap naming standard is value/name, but that is sometimes difficult to get from a server, 
it might not support it.
Therefore, a "map"-property is provided. <br />
The property in valueProperty says in what property to look for the value, and nameProperty the name.
In this case:

    {nodeId : 1, nodeName: "Test", "nodeType": "99"}
which cannot be used, is converted into:

    {value : 1, name: "Test", nodeId : 1, nodeName: "Test", "nodeType": "99"}
which is the native format with the old options retained to not destroy auxiliary information.
For example, a field like "nodeType" might be used for filtering(see Filters section, below). 
The options for that mapping look like this:

     {
       "key": "multiselectdynamic_http_get",
       "type": 'strapselect',
       "options": {
            "multiple": "true"
            "httpGet": {
                "url": "test/testdata_mapped.json"
            },
            "map" : {valueProperty: "nodeId", nameProperty: "nodeName"}
       }
     },    
     
This is convenience functionality, for more complicated mappings, and situations where the source data is
in a completely different format, the callback and asyncCallback options should be used instead.

## Filters

Filters, like [conditions](https://github.com/Textalk/angular-schema-form/blob/development/docs/index.md#standard-options) 
handle visibility, but for each item in the options list.

It works by evaluating the filter expression for each row, if it evaluates to true, the option remains in the list.
One could compare it with an SQL join.
 
The options are:

* filter : An expression, evaluated in the user scope, with the "item" local variable injected. "item" is the current list item, `"model.select==item.category"`
* filterTrigger : An array of expressions triggering the filtering, `"model.select"`

Example:

    {
        "key": 'multiselect',
        "type": 'strapselect',
        options: {
            "multiple": "true"           
            "filterTriggers": ["model.select"],
            "filter" : "model.select==item.category"
        },
        "items": [
            {"value": 'value1', "name": 'text1', "category": "value1"},
            {"value": 'value2', "name": 'text2', "category": "value1"},
            {"value": 'value3', "name": 'long very very long label3'}
        ]
    },

Note on filterTrigger and why not having a watch on the entire expression:

* The expression is actually a one-to-many join, and mixes two scopes in the evaluation. This might not always be handled the same by $eval. 
* Adding watches for the expression would mean having to add one watch for each list item, long lists would mean a huge overhead.
* Also, there might be use cases where triggering should be triggered by other conditions. Or not be triggered for some other reason.

## Defaults and enum
If a there is a form item that only has type "string" defined, but has an enum value, then a single select will be shown for that value.

    {
        "key": 'select'
    },
    
The schema declaration(the enum values will be both value and name for the options): 
   
    select: {
        title: 'Single Select Static',
        type: 'string',
        enum: ["value1", "value2", "value3"],
        description: 'Only single item is allowed. Based on schema enum and form default.(change here and observe how the select list below is filtered)'
    },

## inlineMaxLength and inlineMaxLengthHtml angularStrap parameters.
These settings affects only [strapselect](http://mgcrea.github.io/angular-strap/#/selects-usage) and controls the number of items that are shown in the selected list of items.
If that list is full, the number of list items + the test in inlineMaxLengthHtml is shown.
If, for example, inlineMaxLength is set to 2 and the number of selected items is 4, the text shown will be `4 items are too many items to show....` 

Example(the same as in the example file):

    "key": 'multiselect_overflow',
    "type": 'strapselect',
    "placeholder": "Please select some items.",
    "options": {
        "multiple": "true",
        "inlineMaxLength": "2",
        "inlineMaxLengthHtml": " items are too many items to show...."
    },
    "titleMap": [
        {"value": 'value1', "name": 'text1'},
        {"value": 'value2', "name": 'text2'},
        {"value": 'value3', "name": 'text3'},
        {"value": 'value4', "name": 'text4'},
    ]


### And then a submit button. 
Not needed, of course, but is commonly used.

     {
       type: "submit",
       style: "btn-info",
       title: "OK"
     }
     
And ending the form element array:

    ];
    

# Feature summary

The options.items property in form holds the list items(also in the dynamic variants).

All select types can handle:

* property mappings
* filters


## Dynamically fetching drop down items
These types are dynamic and fetches their data from different back ends.
#### Callbacks in general
Callbacks can be defined either by name(`"loadGroups"`) or absolute reference (`$scope.loadGroups`). 

The name is actually is an expression evaluated in the user scope that must return a function reference.
This means that it *can* be `"getLoadFunctions('Groups')"`, as long as that returns a function reference.

But the main reason for supporting referring to functions both by name and reference is that forms 
often is stored in a database and passed from the server to the client in [pure JSON format](http://stackoverflow.com/questions/2904131/what-is-the-difference-between-json-and-object-literal-notation),
and there, `callback: $scope.loadGroups` is not allowed.

#### Callback results
The results of all callbacks can be remapped using the "map" property described above.

The two methods of callback mechanisms are:

### callback and asyncCallback

* list items are fetched by a user-specified callback. User implements the calling mechanism.
* the callback receive the form options as a parameter and returns an array of list items(see the static strapselect)

### httpGet and httpPost

* list items are fetched using a built in async http mechanism, so that the user doesn't have to implement that.
* the url property defines the URL to use.
* the optional optionsCallback can be used to add to or change the options with information known in runtime. 
* httpPost-options has a "parameter"-property, that contains the JSON that will be POST:ed to the server.

# UI-Select
The support for angular-ui-select was added in the 0.9.0-version, and is currently partial.

Its dependencies aren't included in the package.json, and will hence have to be installed manually, here is a script:

    bower install angular-ui-select angular-underscore angular-ui-utils angular-translate angular-ui-select angular-ui-utils angular-sanitize

It is used as strapselect, but by including the form types uiselect and uiselectmultiple instead. 

    {
        "key": 'uiselectmultiple',
        "type": 'uiselectmultiple',
        "titleMap": [
          { value: 'one', name: 'option one'},
          { value: 'two', name: 'option two'},
          { value: 'three', name: 'option three'}
        ]
    },
        
It supports dynamically fetching items from a backend using callbacks and http-methods, but filters, for example, aren't implemented yet.

See the example app in the source for more details on how to use it.

# Recommendations

* Choose httpGet and httpPost over the callback and asyncCallback methods if your don't specifically need the full freedom
of callback and asyncCallback. There is no reason clutter client code with http-request handling unless you have to.
* Given the asynchronous nature of javascript development, try use asynchronous alternatives before synchronous that block the UI.
* The way the plug-ins works, they register themselves as defaults for all matching types. <br />
As long this is the case, all relevant fields must specify the "type"-property. <br />
If not, they will get the wrong editor. Either way, it is recommended to define the type.


# Bugs, omissions, feature requests 

Please [report *all* issues you encounter](https://github.com/OptimalBPM/schema-form-dynamic-select/issues)

If you suspect that there is a bug in angular-schema-form-dynamic-select that isn't reproducible in any of the examples,<br />
please make a small example in plunkr or similar where you recreate the problem, it will make it easier to help you.<br />

If something is difficult to understand, that is also an issue, please ask for clarification if the documentation is insufficient.

Any ideas on new features are always welcome.

# Building

Building and minifying is done using [gulp](http://gulpjs.com/) 

### Installing gulp
To install gulp, you need npm:

```bash
$ npm install gulp -g
```
### Running the build

In the project root folder, run:

```bash
$ gulp default
```

# Contributing

Pull requests are always very welcome. Try to make one for each thing you add, don't do [like this author(me) did](https://github.com/chengz/schema-form-strapselect/pull/2).

Remember that the next version is in the develop branch, so if you want to add new features, do that there.<br />
If you want to fix a bug, do that against the master branch and it will be merged into the develop branch later.



# Testing

Unit testing is done using [Karma and Jasmine](http://karma-runner.github.io/0.12/intro/installation.html).
The main configuration file for running tests is karma.conf.js, and test/tests.js holds the test code.
First, make sure the relevant development dependencies are installed:

```bash
$ npm update
```

To run the tests:


```bash
$ node_modules/karma/bin/karma start karma.conf.js
```
# Breaking change history

<b>Important: Over the early minor versions, there has been considerable changes:</b>

* 0.3.0: all dynamic-select-related settings moved to the form.
* 0.3.3: value/name-pairs for drop down data is deprecated.<br />
The correct way, and how the HTML select element actually works, is value/text.(note: Reverted in 0.8.0)<br />
The the add-on still supports both variants, but value/name will be removed.<br /> 
* 0.4.0: use the options.map functionality instead.<br /> 
* 0.5.0: Breaking changes:
  * http_post and http_get are renamed to httpPost and httpGet.
  * async.callback is removed and asyncCallback is used instead.
* 0.6.0: earlier deprecated support for value/name-pairs is now removed 
* 0.7.0: meant a forced update of dependencies and some rewriting, since:
  * 2.2.1 of angular-strap has breaking changes making it impossible to keep backwards compatibility.
  * 0.8.0 of angular-schema-form, which also has breaking changes had to be updated to stay compatible with angular-straps' dependencies.
* 0.8.0: Harmonization with angular-schema-form to be a drop-in replacement
  * Breaking change: The items array is now renamed to titleMap, as in ASF.
  * Value/name-pairs for drop-down data is now reintroduced (value/text is still supported)
* 0.9.0: Breaking changes: strapselectdynamic, strapmultiselect and strapmultiselect was merged into strapselect. 

Note: no further API changes are planned.


# History

1. This component was originally created by [chengz](https://github.com/chengz/). 

2. [stevehu](https://github.com/stevehu) then added functionality to his project to connect to his [light
framework](https://github.com/networknt/light).

3. This inspired [nicklasb](https://github.com/nicklasb) to merge stevehu:s code and rewrite the plugin in order to:

* harmonize it with the current lookup handling in angular-schema-form
* generalize it for it to be able to connect to any backend. 

The rest is extremely recent history(i.e. > 0.3.0).
