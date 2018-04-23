/* Dependencies */
const tap = require('tap');
const canvas = require('canvas-wrapper');

var sourceCourses = {
    'online': 1521,
    'pathway': 1521,
    'campus': 1521
};

module.exports = (course, callback) => {
    tap.test('child-template', (test) => {

        // Get new course's tabs
        canvas.get(`/api/v1/courses/${course.info.canvasOU}/tabs`, (err, courseTabs) => {
            if (err) {
                course.error(err);
                test.end();
            }

            // Get source course's tabs
            canvas.get(`/api/v1/courses/${sourceCourses[course.settings.platform]}/tabs`, (sourceErr, sourceTabs) => {
                if (sourceErr) {
                    course.error(sourceErr);
                    test.end();
                }

                courseTabs.forEach((courseTab, index) => {
                    // Testing IDs (and positions)
                    test.equal(courseTab.id, sourceTabs[index].id, `${courseTab.id} did not equal the source course tab ID: ${sourceTabs[index].id}`);
                    // Testing whether they're hidden correctly
                    test.equal(courseTab.hidden, sourceTabs[index].hidden, `${courseTab.id} did not equal the source course tab's hidden status: ${sourceTabs[index].hidden}`);
                });

                test.end();
            });
        });
    });

    callback(null, course);
};