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
                        this.challenge.webaccess.url = 'https://beta-web.cw.com.tw/activity/redirect/f46ef0b8-4591-40e8-a399-fea691fe1278';
                        this.challenge.cwlearing.url = 'https://beta-web.cw.com.tw/activity/redirect/5497f2b9-9014-4e19-8057-085afd87e860';
                        this.challenge.publishing.url = 'https://beta-web.cw.com.tw/activity/redirect/db77d414-114f-47f0-a110-f4d59d63decb';
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
