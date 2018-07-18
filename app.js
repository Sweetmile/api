'use strict';

module.exports = app => {
    app.beforeStart(async() => {
        console.log("Loading...");
    })
};