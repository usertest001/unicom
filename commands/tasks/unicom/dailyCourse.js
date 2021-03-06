
const { appInfo, buildUnicomUserAgent } = require('../../../utils/device')
var crypto = require('crypto');
const { signRewardVideoParams } = require('./CryptoUtil')
var transParams = (data) => {
    let params = new URLSearchParams();
    for (let item in data) {
        params.append(item, data['' + item + '']);
    }
    return params;
};

var sign = (data) => {
    let appid = 'wxx1ti4jqh7mfxlg'
    let key = 'ugil4363jdbh473s0bmrhjjy3re1xt'
    let str = [appid, key, data.duration, data.ocId, data.ocsId, data.realtime, data.time, data.uId].join('')
    return crypto.createHash('md5').update(str).digest('hex').toUpperCase()
}

var dailyCourse = {
    shoutingAppLogin: async (axios, options) => {
        const useragent = buildUnicomUserAgent(options, 'p')
        let { data } = await axios.request({
            headers: {
                "user-agent": useragent,
                // "accessToken": "Bearer df6a34af6cda4e2b8158898dda9810a2",
                "referer": `https://edu.10155.com/sthall/?jrPlatform=SHOUTING&envtag=sthall&chc=ByIGdlJ9V3JTYVFwUTM&stAppVersion=8&yw_code=&desmobile=${options.user}&version=${appInfo.unicom_version}`,
                "jrPlatform": "10",
                "X-Requested-With": appInfo.package_name
            },
            url: `https://edu.10155.com/wxxinterface/shouTing/shoutingAppLogin?jrPlatform=SHOUTING`,
            method: 'post',
            data: 'stalp=czepeshxpte'
        })
        if (data.code === 200) {
            return data.result
        } else {
            return {}
        }
    },
    getCourseList: async (axios, options) => {
        const { accessToken } = options
        const useragent = buildUnicomUserAgent(options, 'p')
        let { data } = await axios.request({
            headers: {
                "user-agent": useragent,
                "accessToken": accessToken,
                "referer": `https://edu.10155.com/sthall/?jrPlatform=SHOUTING&envtag=sthall&chc=ByIGdlJ9V3JTYVFwUTM&stAppVersion=8&yw_code=&desmobile=${options.user}&version=${appInfo.unicom_version}`,
                "jrPlatform": "10",
                "X-Requested-With": appInfo.package_name
            },
            url: `https://edu.10155.com/wxxinterface/shouTing/detail?jrPlatform=SHOUTING`,
            method: 'get'
        })
        if (data.code === 200) {
            return data.result.detail.find(d => d.type === '11').list.filter(c => c.ocFreeTry === 1)
        } else {
            return []
        }
    },
    getCourseChapters: async (axios, options) => {
        const { ocId, accessToken } = options
        const useragent = buildUnicomUserAgent(options, 'p')
        let { data } = await axios.request({
            headers: {
                "user-agent": useragent,
                "accessToken": accessToken,
                "referer": `https://edu.10155.com/sthall/?jrPlatform=SHOUTING&envtag=sthall&chc=ByIGdlJ9V3JTYVFwUTM&stAppVersion=8&yw_code=&desmobile=${options.user}&version=${appInfo.unicom_version}`,
                "jrPlatform": "10",
                "X-Requested-With": appInfo.package_name
            },
            url: `https://edu.10155.com/wxxinterface/course/detail?ocId=${ocId}&jrPlatform=SHOUTING`,
            method: 'get'
        })
        if (data.code === 200) {
            return data.result.chapters
        } else {
            return []
        }
    },
    joinCourse: async (axios, options) => {
        const { ocId, ocsId, accessToken } = options
        const useragent = buildUnicomUserAgent(options, 'p')

        let { data: freedata } = await axios.request({
            headers: {
                "user-agent": useragent,
                "accessToken": accessToken,
                "referer": `https://edu.10155.com/sthall/?jrPlatform=SHOUTING&envtag=sthall&chc=ByIGdlJ9V3JTYVFwUTM&stAppVersion=8&yw_code=&desmobile=${options.user}&version=${appInfo.unicom_version}`,
                "jrPlatform": "10",
                "X-Requested-With": appInfo.package_name
            },
            url: `https://edu.10155.com/wxxinterface/shouTing/getFreeCourse?jrPlatform=SHOUTING`,
            method: 'post',
            data: transParams({
                'ocId': ocId,
                'productType': 0,
            })
        })

        if (freedata.code === 200) {
            console.info('??????????????????')
        } else {
            console.error('??????????????????')
            return false
        }

        let { data } = await axios.request({
            headers: {
                "user-agent": useragent,
                "accessToken": accessToken,
                "referer": `https://edu.10155.com/sthall/?jrPlatform=SHOUTING&envtag=sthall&chc=ByIGdlJ9V3JTYVFwUTM&stAppVersion=8&yw_code=&desmobile=${options.user}&version=${appInfo.unicom_version}`,
                "jrPlatform": "10",
                "X-Requested-With": appInfo.package_name
            },
            url: `https://edu.10155.com/wxxinterface/course/play?&ocId=${ocId}&ocsId=${ocsId}&jrPlatform=SHOUTING`,
            method: 'get'
        })
        if (data.code === 200) {
            console.info('??????????????????')
            return true
        } else {
            console.error('??????????????????')
            return false
        }
    },
    reportTime: async (axios, options) => {
        const { course, section, userInfo, accessToken, totalTime } = options
        const useragent = buildUnicomUserAgent(options, 'p')

        let params = {
            'isReport': 1,
            'ocId': course.ocId,
            'ocsId': section.ocsId,
            'time': totalTime,
            'duration': section.ocsDuration,
            'realtime': '15',
            'appId': 'wxx1ti4jqh7mfxlg',
        }

        params['appSign'] = sign({
            ...params,
            uId: userInfo.uId
        })

        let { data } = await axios.request({
            headers: {
                "user-agent": useragent,
                "accessToken": accessToken,
                "referer": `https://edu.10155.com/sthall/?jrPlatform=SHOUTING&envtag=sthall&chc=ByIGdlJ9V3JTYVFwUTM&stAppVersion=8&yw_code=&desmobile=${options.user}&version=${appInfo.unicom_version}`,
                "jrPlatform": "10",
                "X-Requested-With": appInfo.package_name
            },
            url: `https://edu.10155.com/wxxinterface/course/userStudyRecord?jrPlatform=SHOUTING`,
            method: 'post',
            data: transParams(params)
        })
        if (data.code === 200) {
            console.info('??????????????????')
            return true
        } else {
            console.info('??????????????????')
            return false
        }
    },
    enrollAct: async (axios, options) => {
        const { accessToken } = options
        const useragent = buildUnicomUserAgent(options, 'p')
        let { data } = await axios.request({
            headers: {
                "user-agent": useragent,
                accessToken,
                "referer": `https://edu.10155.com/sthall/?jrPlatform=SHOUTING&envtag=sthall&chc=ByIGdlJ9V3JTYVFwUTM&stAppVersion=8&yw_code=&desmobile=${options.user}&version=${appInfo.unicom_version}`,
                "jrPlatform": "2",
                "X-Requested-With": appInfo.package_name
            },
            url: `https://edu.10155.com/wxx-api/Api/ShoutingAct/enrollMulti`,
            method: 'post',
            data: transParams({
                'actId': '4'
            })
        })
        if (data.code === 0) {
            console.info('????????????')
        } else {
            console.error('????????????')
        }
    },
    getStatus: async (axios, options) => {
        const { accessToken } = options
        const useragent = buildUnicomUserAgent(options, 'p')
        let { data } = await axios.request({
            headers: {
                "user-agent": useragent,
                accessToken,
                "referer": `https://edu.10155.com/sthall/?jrPlatform=SHOUTING&envtag=sthall&chc=ByIGdlJ9V3JTYVFwUTM&stAppVersion=8&yw_code=&desmobile=${options.user}&version=${appInfo.unicom_version}`,
                "jrPlatform": "2",
                "X-Requested-With": appInfo.package_name
            },
            url: `https://edu.10155.com/wxx-api/Api/ShoutingAct/getUserActLog`,
            method: 'post',
            data: transParams({
                'p': '',
                'chc': 'VnMAcA8zDzhUOgRnVy0CMQZoB2EBeVRjBDA',
                'jrPlatform': 'ACTIVITY',
                'ua': useragent,
                'cookie': '',
                'actId': '4'
            })
        })
        if (data.code === 0) {
            return data.data
        } else {
            return {}
        }
    },
    // ??????7??????????????? ????????????30??????
    doTask: async (axios, options) => {
        // enditme 1639152e6
        let phone = options.user
        if (['170', '171', '149', '162', '165', '167'].indexOf(phone.substr(0, 3)) !== -1) {
            console.info('????????????????????????', phone.substr(0, 3))
            return
        }
        let { accessToken, userInfo } = await dailyCourse.shoutingAppLogin(axios, options)
        if (!accessToken) {
            throw new Error('?????????????????????????????????')
        }

        let status = await dailyCourse.getStatus(axios, {
            ...options,
            accessToken
        })

        let state = 0

        // 1???????????????2????????????
        if (status.info.sal_is_success === "1" || status.info.sal_is_success === "2") {
            console.info('???????????????????????????????????????')
            return
        }

        if (Date.now() < 1e3 * status.info.sal_end_time && status.info.sal_success1_time !== '0') {
            state = 1
        }

        if (state === 0 && status.info.sal_success1_time === '0') {
            await dailyCourse.enrollAct(axios, {
                ...options,
                accessToken
            })
        } else if (state === 1) {
            console.info('????????????', `?????????${status.info.sal_days}???`, `????????????${new Number(status.time / 60).toFixed(1)}??????`)
            if (status.time > 30 * 60) {
                console.info('?????????????????????30???????????????????????????')
                return
            }
        }

        let list = await dailyCourse.getCourseList(axios, {
            ...options,
            accessToken
        })

        let totaltime = 0
        let maxtime = 30 * 60 + Math.floor(Math.random() * 10) * 57// - status.time

        do {
            // let course = list[Math.floor(Math.random() * list.length)]
            for (let course of list) {
                let chapters = await dailyCourse.getCourseChapters(axios, {
                    ...options,
                    accessToken,
                    ocId: course.ocId,
                })
                for (let chapter of chapters) {
                    let sections = chapter.sections
                    for (let section of sections) {
                        console.info('????????????', chapter.occName, section.ocsName)
                        await dailyCourse.joinCourse(axios, {
                            ...options,
                            accessToken,
                            ocId: course.ocId,
                            ocsId: section.ocsId
                        })
                        let n = Math.floor(section.ocsDuration / 15)
                        let i = 1
                        do {
                            console.info(`???${i}???`)
                            await dailyCourse.reportTime(axios, {
                                ...options,
                                course,
                                section,
                                userInfo,
                                accessToken,
                                totalTime: i * 15
                            })
                            await new Promise(resolve => setTimeout(resolve, 10 * (999 + Math.random() * 3)))
                            totaltime = totaltime + 15
                            if (totaltime >= maxtime) {
                                console.info('????????????30???????????????')
                                return
                            }
                        } while ((++i) <= n)
                    }
                }
            }
        } while (totaltime < maxtime)
    }
}
module.exports = dailyCourse