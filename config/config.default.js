'use strict';

const path = require('path');

module.exports = appInfo =>{
    const config = {};
    config.keys = appInfo.name + '_15023491298822_1564';


    config.mysql = {
        client: {
            host: 'localhost',
            port: '3306',
            user: 'xyzhao_apis',
            password: 'apis',
            database: 'xyzhao_apis'
        },
        app: true,
        agent: false
    };

    return config;
};