# Set Navigation Tabs
### *Package Name*: set-navigation-tabs
### *Child Type*: post-import
### *Platform*: online
### *Required*: Required

This child module is built to be used by the Brigham Young University - Idaho D2L to Canvas Conversion Tool. It utilizes the standard `module.exports => (course, stepCallback)` signature and uses the Conversion Tool's standard logging functions. You can view extended documentation [Here](https://github.com/byuitechops/d2l-to-canvas-conversion-tool/tree/master/documentation).

## Purpose
It sets the navigation tabs for the imported course following the pattern specified in the tabsTemplate.js file.

## How to Install
npm install

npm update
 
npm start to run the child module

## Run Requirements
Does not apply

## Options
Does not apply

## Outputs
The course changed in resetting the navigation tabs

## Process
The steps: 
1. get tab information to use in the resetting it
2. reset the tab with the API call 

## Log Categories
Does not apply

## Requirements
Does not apply