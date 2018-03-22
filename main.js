/*eslint-env node, es6*/
/*eslint no-unused-vars:1*/
/*eslint no-console:0, semi: 2*/

/* The module sets up the course navigation tabs as it is specified in the tabsTamplate.js file */

var canvas = require('canvas-wrapper'),
    tabsTemplate = require('./tabsTemplate.js'),
    asyncLib = require('async');

module.exports = function (course, stepCallback) {
    var cID = course.info.canvasOU;
    var courseName = course.info.fileName.split('.zip')[0];

    // STEP #1
    // get all tabs (they will be used in steps 2 and 3)
    function getTabs(cb1) {
        canvas.get(`/api/v1/courses/${cID}/tabs`, function (err, tabs) {
            if (err) {
                course.error(err);
                cb1(err);
                return;
            }
            course.message(`Retrieved the tabs for the "${courseName}" course (canvasOU: ${course.info.canvasOU})`);
            cb1(null, tabs);
        });
    }

    // #2-1a (called from step #2-1)
    function hideTab(tab, cb2) {
        var urlOut = `/api/v1/courses/${cID}/tabs/${tab.id}`,
            options = {
                'hidden': true
            };
        // home and settings cannot be hidden or moved (see Tabs API)
        if (tab.id !== 'home' && tab.id !== 'settings') {
            canvas.put(urlOut, options, function (err) {
                if (err) {
                    course.error(err);
                    cb2(err);
                    return;
                }
                course.log('Tabs set to hidden', {
                    'Tab Id': tab.id
                });
                cb2(null);
            });
        } else {
            cb2(null);
        }
    }

    // #2-2a (called from step #2-2)
    function changeTab(tab, cb3) {
        var urlOut = `/api/v1/courses/${cID}/tabs/${tab.id}`;
        canvas.put(urlOut, {
            position: tab.position,
            hidden: tab.hidden
        }, function (err) {
            if (err) {
                cb3(null, {
                    tab: tab,
                    err: err
                });
                return;
            }
            cb3(null, {
                tab: tab,
                err: null
            });
        });
    }

    // STEP #2-1
    // remove the tamplate tabs and set the rest to "hidden: true"
    function setTabs(tabs, cb4) {
        // remove tabs that are on the template
        // tabs.filter returns the array of tabs filtered against
        // tabs.Template.js (all the tabs that need to be passed to
        // next method for making those tabs hidden)
        var onesThatNeedToBeHidden = tabs.filter(function (tab) {
            return tabsTemplate.every(function (tabOnTemplate) {
                return tabOnTemplate.id !== tab.id;
            });
        });
        // make not-on-tamplate tabs "hidden: true"
        asyncLib.eachSeries(onesThatNeedToBeHidden, hideTab, function (eachErr) {
            if (eachErr) {
                course.error(eachErr);
                cb4(null, course);
                return;
            }
            course.message('Tabs that need to be hidden for the course have been reset to hidden');

            // STEP #2-2
            // reset on-template tabs
            asyncLib.mapSeries(tabsTemplate, changeTab, function (err, mappedTabs) {
                var hasErrors = false;
                // the vars to use in the success report
                var position = 2;
                var hidden = 'false';
                mappedTabs.forEach(function (tab) {
                    //there was an error
                    if (tab.err !== null) {
                        // console.log(tab.tab.id);
                        // console.log(tab.err);
                        course.error(tab.err.message);
                        hasErrors = true;
                    } else {
                        course.log('Reorganized Tabs', {
                            'Tab Name': tab.tab.id,
                            'New Position': position,
                            'Hidden': hidden
                        });
                    }
                    position++;
                    if (position === 6) {
                        hidden = 'true';
                    }
                });
                if (!hasErrors) {
                    course.message('All tabs in the course have been reset');
                }
                // this is the final callback from the bottom of 
                // the call well (it is defined in the waterfall)
                cb4(null);
            });
        });
    }

    asyncLib.waterfall([
        getTabs,
        setTabs,
    ],
        function () {
            stepCallback(null, course);
        });
};
