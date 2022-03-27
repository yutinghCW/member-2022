import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js';
let that = null;
let times = 0;
const app = createApp({
    data() {
        return {
            video: '',
            user: {
                uid: '',
                name: '',
                email: '',
            },
            challenge: {
                read: false,
                learn: false,
                book: false,
            },
            learn: {
                lang: {
                    video: 'https://www.youtube.com/embed/icw2vbxTeSk',
                    state: false,
                    finished: false,
                },
                tsou: {
                    video: 'https://www.youtube.com/embed/WU2ak1Ww7E8',
                    state: false,
                    finished: false,
                },
                tsai: {
                    video: 'https://www.youtube.com/embed/n0F3AcDb9CI',
                    state: false,
                    finished: false,
                },
            },
            eventLabel: '',
        }
    },
    mounted () {
        that = this;
        this.checkLogin();
        this.getEventState();
        var rellax = new Rellax('.rellax', {
            speed: 0,
            breakpoints:[768]
        });
    },
    methods: {
        checkLogin() {
            const userMe = 'https://dev-www.cw.com.tw/api/v1.0/user/me?fields=name,email,uid';
            axios
                .get(userMe)
                .then((response) => {
                    console.log(response.data);
                    if ( response.data.code === '0001' ) {
                        window.location.href = 'index.html'
                    } else {
                        if ( window.location.search.indexOf('from=login') ) {
                            if ( !this.getCookie('member-2022') ) {
                                this.setCookie('member-2022', 'set-cookie-for-member-2022', 90);
                            } else {
                                this.clickSF();
                                dataLayer.push({
                                    'event': 'GAEventTrigger',
                                    'eventCategory': 'member-2022',
                                    'eventAction': 'start',
                                    'eventLabel': '',
                                });
                            }
                        }
                        this.user = response.data.items[0];
                    }
                })
                .catch((error) => {
                    console.dir(error);
                });
        },
        clickPlayer(name) {
            this.video = this.learn[name].video;
            new bootstrap.Modal(document.getElementById('videoModal')).show();

            // Api: 先參與遊戲 
            const learnCreate = 'https://dev-www.cw.com.tw/api/v1.0/activity/create?event_name=learn';
            axios
                .get(learnCreate)
                .then((response) => {
                    console.dir(response);
                })
                .catch((error) => {
                    console.dir(error);
                });
            // Api: Modal 關閉後要送資料 
            const learnSuccess = 'https://dev-www.cw.com.tw/api/v1.0/activity/create?event_name=learn&is_finish=1';
            $('#videoModal').on('shown.bs.modal', function () {
                times = 0;
            });
            $('#videoModal').on('hidden.bs.modal', function () {
                times ++;
                that.video = '';
                if ( times === 1 ) {
                    axios
                        .get(learnSuccess)
                        .then((response) => {
                            console.dir(response);
                            console.log(that.challenge.learn);
                            if ( !that.challenge.learn ) {
                                new bootstrap.Modal(document.getElementById('successModal')).show();
                                dataLayer.push({
                                    'event': 'GAEventTrigger',
                                    'eventCategory': 'member-2022',
                                    'eventAction': 'finish',
                                    'eventLabel': '3D_L',
                                });
                            }
                            setTimeout(() => {
                                that.challenge.learn = true;
                                that.getEventState();
                                that.clickSF();
                            }, 300);
                        })
                        .catch((error) => {
                            console.dir(error);
                        });
                }
            });
        },
        getEventState() {
            const activityCreate = 'https://dev-www.cw.com.tw/api/v1.0/activity/get';
            axios
                .get(activityCreate)
                .then((response) => {
                    let arry = response.data.items;
                    if ( arry.length > 0 ) {
                        this.eventLabel += '3D';
                        arry.forEach(element => {
                            switch (element.event_name) {
                                case 'read':
                                    this.eventLabel += '_K';
                                    break;
                                case 'learn':
                                    this.eventLabel += '_L';
                                    break;
                                case 'book':
                                    this.eventLabel += '_B';
                                    break;
                            }
                            if ( element.is_finish === 1 ) {
                                this.challenge[element.event_name] = true;
                            }
                        });
                    }
                    $("#sendBtn").click();
                })
                .catch((error) => {
                    console.dir(error);
                });
        },
        clickSF() {
            $("#sendBtn").click();
        },
    }
})
app.mount('#app')
