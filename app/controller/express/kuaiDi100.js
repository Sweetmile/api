'use strict';

const Controller = require('egg').Controller;

class KuaiDi100Controller extends Controller {

    async judge() {
        this.ctx.body = await this.ctx.service.express.kuaiDi100.judge(this.ctx.params.postId);
    }

    async query() {
        this.ctx.body = await this.ctx.service.express.kuaiDi100.query(this.ctx.params.company, this.ctx.params.postId);
    }

    async smartQuery() {
        let company = await this.ctx.service.express.kuaiDi100.judge(this.ctx.params.postId);
        if (company.status === false) {
            this.ctx.body = company;
            // return;
        } else {
            company = company.result.categories;
            const res = {};
            for (let i = 0; i < company.length; ++i) {
                let queryResult = await this.ctx.service.express.kuaiDi100.query(company[i].number, this.ctx.params.postId);
                if (queryResult.status !== false) {
                    queryResult.result.name = company[i].name;
                    res[company[i].number] = queryResult.result;
                }
            }
            if(res.length !== 0) {
                this.ctx.body = {
                    status: true,
                    result: res
                }
            } else {
                this.ctx.body = {
                    status: false,
                    result: "未找到合适的快递公司"
                }
            }
        }

    }
}

module.exports = KuaiDi100Controller;