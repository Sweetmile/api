'use strict';

const Service = require('egg').Service;


const KUAIDI_100_URL = 'https://www.kuaidi100.com';

class KuaiDi100Service extends Service {

    async updateAllCompany() {
        const response = await this.ctx.curl(KUAIDI_100_URL + '/company.do', {
            method: 'GET',
            timeout: 10000,
            data: {
                method: 'js'
            }
        });
        if (response.status !== 200 || response.data == null) {
            return {
                status: false,
                result: "Request failed"
            }
        }
        try {
            let json = response.data.toString().split("jsoncom=")[1].replace(/'/g, '"');
            json = JSON.parse(json.substring(0, json.length - 1)).company;
            const updates = async (item) => {
                let res = await this.app.mysql.select('expressInfo', {
                    where: {id: item.id},
                });
                if (res.length === 1) {
                    await this.app.mysql.update('expressInfo', item, {where: {com_id: res[0].com_id}});
                } else {
                    await this.app.mysql.insert('expressInfo', item);
                }
            };
            for (let i = 0; i < json.length; ++i) {
                updates(json[i]);
            }
            return {
                status: true,
                result: "Success"
            };
        } catch (e) {
            return {
                status: false,
                result: "Save failed"
            }
        }
    }

    async judge(postId) {
        const response = await this.ctx.curl(KUAIDI_100_URL + '/autonumber/autoComNum', {
            method: 'GET',
            dataType: 'json',
            data: {
                text: postId
            }
        });
        if (response.status === 200 && response.data.num === postId) {
            return {
                status: true,
                result: {
                    postId: response.data.num,
                    categories: await Promise.all(response.data.auto.map(async (tmp) => {
                        let res = await this.app.mysql.select('expressInfo', {
                            where: {number: tmp.comCode},
                        });
                        return {number: tmp.comCode, name: res.length === 1 ? res[0].name : "Unknown"};
                    }))
                }
            };
        } else {
            return {
                status: false,
                result: "请求失败"
            }
        }
    }

    async query(company, postId) {
        const response = await this.ctx.curl(KUAIDI_100_URL + '/query', {
            method: 'GET',
            dataType: 'json',
            data: {
                postid: postId,
                type: company
            }
        });
        if (response.status === 200 && response.data.status === '200') {
            let res = response.data;
            delete res.message;
            delete res.ischeck;
            delete res.condition;
            delete res.status;
            delete res.state;
            return {
                status: true,
                result: res
            }
        } else {
            return {
                status: false,
                result: response.data.message != null ? response.data.message : "请求失败"
            }
        }
    }
}


module.exports = KuaiDi100Service;