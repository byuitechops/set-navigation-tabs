const canvas = require('canvas-wrapper');
const asyncLib = require('async');

module.exports = (course, stepCallback) => {

    var courseTabs = [];
    var sourceTabs = [];
    var sourceCourses = {
        'online': 1521,
        'pathway': 1521,
        'campus': 1521
    };

    function getCourseTabs() {
        return new Promise((resolve, reject) => {
            canvas.get(`/api/v1/courses/${course.info.canvasOU}/tabs`, (err, tabs) => {
                if (err) return reject(err);
                courseTabs = tabs;
                resolve();
            });
        })
    }

    function getSourceTabs() {
        return new Promise((resolve, reject) => {
            canvas.get(`/api/v1/courses/${sourceCourses[course.settings.platform]}/tabs`, (err, tabs) => {
                if (err) return reject(err);
                sourceTabs = tabs;
                resolve();
            });
        })
    }

    function setTab(tab, callback) {
        if (tab.id === 'home' || tab.id === 'settings') {
            callback(null);
            return;
        }
        canvas.put(`/api/v1/courses/${course.info.canvasOU}/tabs/${tab.id}`, {
            'position': tab.position,
            'hidden': tab.hidden || false
        }, (err, updatedTab) => {
            if (err) {
                course.error(err);
                callback(null);
                return;
            }
            course.log('Navigation Tabs Updated', {
                'ID': tab.id,
                'Position': tab.position,
                'Hidden': tab.hidden || false
            });
            callback(null);
        });
    }

    function setTabs() {
        return new Promise((resolve, reject) => {
            var newTabs = sourceTabs.map(sourceTab => {
                var courseTab = courseTabs.find(tab => tab.id === sourceTab.id);
                return {
                    id: courseTab.id,
                    hidden: sourceTab.hidden,
                    position: sourceTab.position
                };
            });
            asyncLib.eachSeries(newTabs, setTab, err => {
                if (err) return reject(err);
                resolve();
            });
        })
    }

    getCourseTabs()
        .then(getSourceTabs)
        .then(setTabs)
        .then(() => {
            stepCallback(null, course);
        })
        .catch(err => {
            course.error(err);
            stepCallback(null, course);
        });

};