/*eslint-env node, es6*/
/*eslint no-unused-vars:1*/
/*eslint no-console:0*/

var canvas = require('canvas-wrapper'),
    tabs = require('./tabs.js'),
    async = require('async');

module.exports = function (course, stepCallback) {
    var cID = course.info.canvasOU;

    function changeTab(tab, changeTabCallback) {
        canvas.put(`/api/v1/courses/${cID}/tabs/${tab.id}?position=${tab.position}&hidden=${tab.hidden}`, {}, function (err) {
            if (err) {
                course.throwErr('setTabs', err);
                changeTabCallback(err);
                return;
            }
            course.success(
                'setTabs',
                `The ${tab.id} tab has been reset`
            );
            changeTabCallback(null, {});
        });
    }

    async.map(tabs, changeTab, function (err) {
        if (err) {
            course.throwErr('setTabs', err);
            stepCallback(err);
            return;
        }
        course.success(
            'setTabs',
            `The tabs of the ${cID} course have been reset`
        );
    });
    stepCallback(null, course);
}
