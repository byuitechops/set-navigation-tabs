# Set Navigation Tabs
### *Package Name*: set-navigation-tabs
### *Child Type*: post-import
### *Platform*: online
### *Required*: Required

This child module is built to be used by the Brigham Young University - Idaho D2L to Canvas Conversion Tool. It utilizes the standard `module.exports => (course, stepCallback)` signature and uses the Conversion Tool's standard logging functions. You can view extended documentation [Here](https://github.com/byuitechops/d2l-to-canvas-conversion-tool/tree/master/documentation).

## Purpose
It sets the navigation tabs for the imported course following the pattern specified in the tabsTemplate.js file.

## How to Install

```
Set CANVAS_API_TOKEN=10706~vXrrAZ24w3zWLqviu25tTkKjozI32IgqolFW4pVpcPiI81pFIkpkEHaynrc646km
```
```
npm install set-syllabus
```
```
npm start update
```

## Run Requirements

course.info

course.error

course.message

course.log

## Options

The tab are reset on the next template:

```js
[{
    "id": "announcements",
    "position": 2,
    "hidden": false,
    }, {
    "id": "syllabus",
    "position": 3,
    "hidden": false,
    }, {
    "id": "modules",
    "position": 4,
    "hidden": false,
    }, {
    "id": "grades",
    "position": 5,
    "hidden": false,
    }, {
    "id": "people",
    "position": 6,
    "hidden": false,
    }, {
    "id": "pages",
    "position": 7,
    "hidden": true,
    }, {
    "id": "files",
    "position": 8,
    "hidden": true,
    }, {
    "id": "outcomes",
    "position": 9,
    "hidden": true,
    }, {
    "id": "assignments",
    "position": 10,
    "hidden": true,
    }, {
    "id": "quizzes",
    "position": 11,
    "hidden": true,
    }, {
    "id": "discussions",
    "position": 12,
    "hidden": true,
    }, {
    "id": "conferences",
    "position": 13,
    "hidden": true,
    }, {
    "id": "collaborations",
    "position": 14,
    "hidden": true,
    }, {
    "id": "context_external_tool_7",
    "position": 15,
    "hidden": true,
    }, {
    "id": "context_external_tool_2",
    "position": 16,
    "hidden": true,
    }, {
    "id": "context_external_tool_1",
    "position": 17,
    "hidden": true,
    }, {
    "id": "context_external_tool_9",
    "position": 18,
    "hidden": true,
    }, {
    "id": "context_external_tool_103",
    "position": 19,
    "hidden": true,
    }, {
    "id": "context_external_tool_132",
    "position": 20,
    "hidden": true,
    }];
```
## Outputs

The course changed in resetting the navigation tabs.
The module does not add anything to `course.info` or anywhere else on the course object.

## Process

The steps: 
1. Get tabs used in the template course for appropriate platform (campus, online, etc.)
2. Reset the tab with the API call 

## Log Categories
``` js
course.log('Tabs set to hidden', 
                   { 'Tab Id': tab.id });

course.log('Reorganized Tabs', 
                           { 'Tab Name': tab.tab.id,
                            'New Position': position,
                            'Hidden': hidden });

course.log('The tabs has been reset', {});
```
## Requirements

The template for resetting the tabs is provided in the tabsTemplate.js file.  The first API call get all the tabs from the course.  The second API call resets the tabs accordingly to the template.