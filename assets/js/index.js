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
    },
    methods: {
        checkLogin() {
            const userMe = 'https://dev-www.cw.com.tw/api/v1.0/user/me?fields=name,email,uid';
            axios
                .get(userMe)
                .then((response) => {
                    // console.log(response.data);
                    if ( response.data.code === '0001' ) {
                        this.challenge.read.url = 'https://beta-web.cw.com.tw/activity/redirect/f46ef0b8-4591-40e8-a399-fea691fe1278';
                        this.challenge.learn.url = 'https://beta-web.cw.com.tw/activity/redirect/5497f2b9-9014-4e19-8057-085afd87e860';
                        this.challenge.book.url = 'https://beta-web.cw.com.tw/activity/redirect/db77d414-114f-47f0-a110-f4d59d63decb';
                    } else if ( response.data.code === '0000' ) {
                        this.challenge.read.url = 'webaccess.html';
                        this.challenge.learn.url = 'cwlearning.html';
                        this.challenge.book.url = 'publishing.html';
                        if ( window.location.search.indexOf('from=login') && !this.getCookie('member-2022') ) {
                            this.setCookie('member-2022', 'set-cookie-for-member-2022', 90);
                            this.clickSF();
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
            const activityCreate = 'https://dev-www.cw.com.tw/api/v1.0/activity/get';
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
            const activityInfo = 'https://dev-www.cw.com.tw/api/v1.0/activity/info';
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
    }
})
app.mount('#app')
