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
            webaccess: {
                hsieh: {
                    state: false,
                    finished: false,
                    player: new Howl({
                        src: 'https://web.cw.com.tw/_test-by-member-2022/assets/audio/webaccess_hsieh.mp3',
                        // src: 'https://www.w3schools.com/html/horse.ogg',
                    }),
                },
                ding: {
                    state: false,
                    finished: false,
                    player: new Howl({
                        src: 'https://web.cw.com.tw/_test-by-member-2022/assets/audio/webaccess_ding.mp3',
                    }),
                },
                sun: {
                    state: false,
                    finished: false,
                    player: new Howl({
                        src: 'https://web.cw.com.tw/_test-by-member-2022/assets/audio/webaccess_sun.mp3',
                    }),
                },
                hua: {
                    state: false,
                    finished: false,
                    player: new Howl({
                        src: 'https://web.cw.com.tw/_test-by-member-2022/assets/audio/webaccess_hua.mp3',
                    }),
                },
                liu: {
                    state: false,
                    finished: false,
                    player: new Howl({
                        src: 'https://web.cw.com.tw/_test-by-member-2022/assets/audio/webaccess_liu.mp3',
                    }),
                },
                tsai: {
                    state: false,
                    finished: false,
                    player: new Howl({
                        src: 'https://web.cw.com.tw/_test-by-member-2022/assets/audio/webaccess_ding.mp3',
                    }),
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
            const readCreate = 'https://dev-www.cw.com.tw/api/v1.0/activity/create?event_name=read';
            const readSuccess = 'https://dev-www.cw.com.tw/api/v1.0/activity/create?event_name=read&is_finish=1';
            axios
                .get(readCreate)
                .then((response) => {
                    console.dir(response);
                })
                .catch((error) => {
                    console.dir(error);
                });
            const array = Object.keys(this.webaccess).filter((item) => {
                return item !== name;
            });
            array.forEach(item => {
                this.webaccess[item].player.pause();
            });
            this.webaccess[name].player.playing() ? this.webaccess[name].player.pause() : this.webaccess[name].player.play();
            this.webaccess[name].player.on('end', function() {
                console.log('Finished!');
                axios
                    .get(readSuccess)
                    .then((response) => {
                        console.dir(response);
                    })
                    .catch((error) => {
                        console.dir(error);
                    });
                setTimeout(() => {
                    that.challenge.read = true;
                    that.getEventState();
                    $(`.duration`).width(0);
                    clearInterval(update);
                }, 300);
                // dataLayer.push({
                //     'event': 'GAEventTrigger',
                //     'eventCategory': 'member-2022',
                //     'eventAction': 'finish',
                //     'eventLabel': '3D_K',
                // });
                new bootstrap.Modal(document.getElementById('successModal')).show();
                return;
            });
            let update = setInterval(() => {
                this.updateWidth(this.webaccess[name].player, name); 
            }, 300);
        },
        updateWidth(player, name) {
            if (player.playing()) {
                let width = (( Number(player.seek().toFixed(1)) / Number(player.duration().toFixed(1)) ) * 100) + '%';
                $(`.${name}_player-duration`).width(width);
                this.webaccess[name].state = true;
            } else {
                if ( this.webaccess[name].state === true ) {
                    this.webaccess[name].state = false;
                }
            }
        },
        getEventState() {
            const activityCreate = 'https://dev-www.cw.com.tw/api/v1.0/activity/get';
            axios
                .get(activityCreate)
                .then((response) => {
                    eventLabel += '3D';
                    let arry = response.data.items;
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
