import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js';
const app = createApp({
    data() {
        return {
            challenge: {
                webaccess: {
                    url: '',
                    text: '',
                    number: 0,
                },
                cwlearing: {
                    url: '',
                    text: '',
                    number: 0,
                },
                publishing: {
                    url: '',
                    text: '',
                    number: 0,
                },
            },
            challenger: false,
        }
    },
    mounted () {
        this.checkLogin();
        this.getChallenger();
    },
    methods: {
        checkLogin() {
            const userMe = 'https://dev-www.cw.com.tw/api/v1.0/user/me?fields=name,email,uid';
            axios
                .get(userMe)
                .then((response) => {
                    console.log(response.data);
                    if ( response.data.code === '0001' ) {
                        this.challenge.webaccess.url = 'https://web.cw.com.tw/activity/redirect/4fe60c92-b821-492d-ad7b-9d23ed0454d0';
                        this.challenge.cwlearing.url = 'https://web.cw.com.tw/activity/redirect/aaf81527-be0a-40d6-a4fb-aadc4d2d1323';
                        this.challenge.publishing.url = 'https://web.cw.com.tw/activity/redirect/2f339511-d042-445f-8ccb-d36f75cb592c';
                    } else if ( response.data.code === '0000' ) {
                        this.challenge.webaccess.url = 'webaccess.html';
                        this.challenge.cwlearing.url = 'cwlearing.html';
                        this.challenge.publishing.url = 'publishing.html';
                    }
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
                    console.log(response.data);
                    this.challenge.webaccess.number = response.data.items.read;
                    this.challenge.cwlearing.number = response.data.items.learn;
                    this.challenge.publishing.number = response.data.items.book;
                    if (
                        this.challenge.webaccess.number >= 1000 &&
                        this.challenge.cwlearing.number >= 1000 &&
                        this.challenge.publishing.number >= 1000
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
