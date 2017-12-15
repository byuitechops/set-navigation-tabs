/*eslint-env node, es6*/
/*eslint no-unused-vars:1*/
/*eslint no-console:0*/

/* The module sets up the course navigation tabs as it is spesified in the tabs.js file */

var canvas = require('canvas-wrapper'),
    tabsTemplate = require('./tabsTamplate.js'),
    async = require('async');

module.exports = (course, stepCallback) => {
    /* Create the module report so that we can access it later as needed.
    This MUST be done at the beginning of each child module. */
    course.addModuleReport('set-navigation-tabs');

    var cID = course.info.canvasOU;
    var courseName = course.info.fileName.split('.zip')[0];

    // #1
    function getTabs(getTabsCallback) {
        canvas.get(`/api/v1/courses/${cID}/tabs`, function (err, tabs) {
            if (err) {
                course.throwErr('set-navigation-tabs', err);
                getTabsCallback(err);
                return;
            }
            course.success(
                'set-navigation-tabs',
                `Retrieved the tabs for the "${courseName}" course (canvasOU: ${course.info.canvasOU})`
            );
            getTabsCallback(null, tabs);
        });
    }

    // #2
    function hideTab(tab, cb2) {
        var urlOut = `/api/v1/courses/${cID}/tabs/${tab.id}`,
            options = {
                "hidden": true
            };
        // home and settings cannot be hidden or moved (see Tabs API)
        if (tab.id !== 'home' && tab.id !== 'settings') {
            canvas.put(urlOut, options, function (err) {
                if (err) {
                    course.throwErr('set-navigation-tabs', err);
                    cb2(err);
                    return;
                }
                course.success(
                    'set-navigation-tabs',
                    `The ${tab.id} tab has been set hidden`
                );
                cb2(null);
            });
        } else {
            cb2(null)
        }
    }

    function setTabsHidden(tabs, cb1) {
        async.eachSeries(tabs, hideTab, function (eachErr) {
            if (eachErr) {
                course.throwErr('set-navigation-tabs', eachErr);
                cb1(null, course);
                return;
            }
            course.success(
                'set-navigation-tabs',
                `All tabs for the "${courseName}" course (canvasOU: ${course.info.canvasOU}) reset to hidden`
            );
            cb1(null);
        });
    }

    // #3
    function changeTab(tab, changeTabCallback) {
        var urlOut = `/api/v1/courses/${cID}/tabs/${tab.id}`;
        canvas.put(urlOut, {
            position: tab.position,
            hidden: tab.hidden
        }, function (err) {
            if (err) {
                changeTabCallback(null, {
                    tab: tab,
                    err: err
                });
                return;
            }
            changeTabCallback(null, {
                tab: tab,
                err: null
            });
        });
    }

    function setCorrectTabs(callback) {
        async.mapSeries(tabsTemplate, changeTab, function (err, mappedTabs) {
            var hasErrors = false;
            mappedTabs.forEach(function (tab) {
                //there was an error
                if (tab.err !== null) {
                    console.log(tab.tab.id)
                    console.log(tab.err)
                    course.throwErr('set-navigation-tabs', tab.err.message);
                    hasErrors = true;
                } else {
                    course.success(
                        'set-navigation-tabs',
                        `The ${tab.tab.id} tab has been reset`
                    );
                }
            });
            if (!hasErrors) {
                course.success(
                    'set-navigation-tabs',
                    `All tabs of the ${cID} course have been reset`
                );
            }
            //            stepCallback(null, mappedTabs);
            callback();
        });
    }

    async.waterfall([
        getTabs,
        setTabsHidden,
        setCorrectTabs
        ],
        function () {
            stepCallback(null, course);
        });
};
