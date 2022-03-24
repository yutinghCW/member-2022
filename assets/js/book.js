import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js';
let that = null;
let times = 0;
let eventLabel = '';
const app = createApp({
    data() {
        return {
            video: '',
            challenge: {
                read: false,
                learn: false,
                book: false,
            },
            book: {
                sun: {
                    video: 'https://www.youtube.com/embed/qIvWNo45t4I',
                    state: false,
                    finished: false,
                },
                tsai: {
                    video: 'https://www.youtube.com/embed/4dKh7NvALg4',
                    state: false,
                    finished: false,
                },
            },
        }
    },
    mounted () {
        that = this;
        this.checkLogin();
        this.getEventState();
    },
    methods: {
        checkLogin() {
            const userMe = 'https://dev-www.cw.com.tw/api/v1.0/user/me?fields=name,email,uid';
            axios
                .get(userMe)
                .then((response) => {
                    if ( response.data.code === '0001' ) {
                        // window.location.href = 'index.html'
                    }
                })
                .catch((error) => {
                    console.dir(error);
                });
        },
        clickPlayer(name) {
            this.video = this.book[name].video;
            new bootstrap.Modal(document.getElementById('videoModal')).show();

            // Api: 先參與遊戲 
            const bookCreate = 'https://dev-www.cw.com.tw/api/v1.0/activity/create?event_name=book';
            axios
                .get(bookCreate)
                .then((response) => {
                    console.dir(response);
                })
                .catch((error) => {
                    console.dir(error);
                });
            // Api: Modal 關閉後要送資料 
            const bookSuccess = 'https://dev-www.cw.com.tw/api/v1.0/activity/create?event_name=book&is_finish=1';
            $('#videoModal').on('shown.bs.modal', function () {
                times = 0;
            });
            $('#videoModal').on('hidden.bs.modal', function () {
                times ++;
                that.video = '';
                if ( times === 1 ) {
                    axios
                        .get(bookSuccess)
                        .then((response) => {
                            console.dir(response);
                            new bootstrap.Modal(document.getElementById('successModal')).show();
                            // dataLayer.push({
                            //     'event': 'GAEventTrigger',
                            //     'eventCategory': 'member-2022',
                            //     'eventAction': 'finish',
                            //     'eventLabel': '3D_L',
                            // });
                            setTimeout(() => {
                                that.challenge.book = true;
                                that.getEventState();
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
                    eventLabel += '3D';
                    let arry = response.data.item;
                    if ( typeof arry === 'undefined' ) {
                        return;
                    }
                    arry.forEach(element => {
                        switch (element.event_name) {
                            case 'read':
                                eventLabel += '_K';
                                break;
                            case 'learn':
                                eventLabel += '_L';
                                break;
                            case 'book':
                                eventLabel += '_B';
                                break;
                        }
                        if ( element.is_finish === 1 ) {
                            this.challenge[element.event_name] = true;
                        }
                    });
                })
                .catch((error) => {
                    console.dir(error);
                });
        },
    }
})
app.mount('#app')
