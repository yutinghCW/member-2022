import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js';
const app = createApp({
    data() {
        return {
            user: {
                uid: '',
                name: '',
                email: '',
            },
            challenge: {
                read: {
                    state: false,
                    url: '',
                    text: '挑戰抽大獎',
                    number: 0,
                },
                learn: {
                    state: false,
                    url: '',
                    text: '挑戰抽大獎',
                    number: 0,
                },
                book: {
                    state: false,
                    url: '',
                    text: '挑戰抽大獎',
                    number: 0,
                },
            },
            challenger: false,
            eventLabel: '',
        }
    },
    mounted () {
        this.checkLogin();
        this.getChallengeState();
        this.getChallenger();
        AOS.init();
    },
    methods: {
        checkLogin() {
            const userMe = 'https://www.cw.com.tw/api/v1.0/user/me?fields=name,email,uid';
            axios
                .get(userMe)
                .then((response) => {
                    // console.log(response.data);
                    if ( response.data.code === '0001' ) {
                        this.challenge.read.url = 'https://web.cw.com.tw/activity/redirect/4fe60c92-b821-492d-ad7b-9d23ed0454d0';
                        this.challenge.learn.url = 'https://web.cw.com.tw/activity/redirect/aaf81527-be0a-40d6-a4fb-aadc4d2d1323';
                        this.challenge.book.url = 'https://web.cw.com.tw/activity/redirect/2f339511-d042-445f-8ccb-d36f75cb592c';
                    } else if ( response.data.code === '0000' ) {
                        this.challenge.read.url = 'webaccess.html';
                        this.challenge.learn.url = 'cwlearning.html';
                        this.challenge.book.url = 'publishing.html';
                        if ( window.location.search.indexOf('from=login') && !this.getCookie('member-2022') ) {
                            this.setCookie('member-2022', 'set-cookie-for-member-2022', 90);
                            dataLayer.push({
                                'event': 'GAEventTrigger',
                                'eventCategory': 'member-2022',
                                'eventAction': 'start',
                                'eventLabel': '',
                            });
                        }
                        this.user = response.data.items[0];
                    }
                })
                .catch((error) => {
                    console.dir(error);
                });
        },
        getChallengeState() {
            const activityCreate = 'https://www.cw.com.tw/api/v1.0/activity/get';
            axios
                .get(activityCreate)
                .then((response) => {
                    console.log(response);
                    let arry = response.data.items;
                    // console.log(arry);
                    arry.forEach((element, index) => {
                        // console.log(element.event_name, index);
                        if ( element.is_finish === 1 ) {
                            this.challenge[element.event_name].state = true;
                            this.challenge[element.event_name].text = '挑戰成功';
                        } else {
                            this.challenge[element.event_name].state = false;
                            this.challenge[element.event_name].text = '挑戰抽大獎';
                        }
                    });
                })
                .catch((error) => {
                    console.dir(error);
                });
        },
        getChallenger() {
            const activityInfo = 'https://www.cw.com.tw/api/v1.0/activity/info';
            axios
                .get(activityInfo)
                .then((response) => {
                    // console.log(response.data);
                    this.challenge.read.number = response.data.items.read;
                    this.challenge.learn.number = response.data.items.learn;
                    this.challenge.book.number = response.data.items.book;
                    if (
                        this.challenge.read.number >= 1000 &&
                        this.challenge.learn.number >= 1000 &&
                        this.challenge.book.number >= 1000
                    ) {
                        this.challenger = true
                    }
                })
                .catch((error) => {
                    console.dir(error);
                });
        },
        setCookie(name, value, day) {
            var expires = new Date();
            expires.setTime(expires.getTime() + (day*24*60*60*1000));
            document.cookie = name + "=" + escape(value) + ";SameSite=Strict;expires=" + expires.toGMTString()
        },
        getCookie(name) {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
        },
    }
})
app.mount('#app')
