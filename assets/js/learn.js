import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js';
let that = null;
let eventLabel = '';
const app = createApp({
    data() {
        return {
            challenge: {
                read: false,
                learn: false,
                book: false,
            },
            learn: {
                lang: {
                    state: false,
                    finished: false,
                },
                tsou: {
                    state: false,
                    finished: false,
                },
                tsai: {
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
                    console.log(response.data);
                    if ( response.data.code === '0001' ) {
                        // window.location.href = 'index.html'
                    }
                })
                .catch((error) => {
                    console.dir(error);
                });
        },
        clickPlayer(name) {
            console.log(name);
            new bootstrap.Modal(document.getElementById(`${name}Modal`)).show();
            const learnCreate = 'https://dev-www.cw.com.tw/api/v1.0/activity/create?event_name=learn';
            console.log(learnCreate);
            // const learnSuccess = 'https://dev-www.cw.com.tw/api/v1.0/activity/create?event_name=learn&is_finish=1';
            axios
                .get(learnCreate)
                .then((response) => {
                    console.dir(response);
                })
                .catch((error) => {
                    console.dir(error);
                });
            // axios
            //     .get(readSuccess)
            //     .then((response) => {
            //         console.dir(response);
            //     })
            //     .catch((error) => {
            //         console.dir(error);
            //     });
        },
        getEventState() {
            const activityCreate = 'https://dev-www.cw.com.tw/api/v1.0/activity/get';
            axios
                .get(activityCreate)
                .then((response) => {
                    eventLabel += '3D';
                    let arry = response.data.item;
                    console.log(arry);
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
