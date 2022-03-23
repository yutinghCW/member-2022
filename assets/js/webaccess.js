import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js';
const app = createApp({
    data() {
        return {
            webaccess: {
                hsieh: {
                    state: false,
                    finished: false,
                },
                ding: {
                    state: false,
                    finished: false,
                },
                sun: {
                    state: false,
                    finished: false,
                },
                hua: {
                    state: false,
                    finished: false,
                },
                liu: {
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
        this.checkLogin();
    },
    methods: {
        checkLogin() {
            const userMe = 'https://www.cw.com.tw/api/v1.0/user/me?fields=name,email,uid';
            axios
                .get(userMe)
                .then((response) => {
                    console.log(response.data);
                    if ( response.data.code === '0001' ) {
                        window.location.href = 'index.html'
                    }
                })
                .catch((error) => {
                    console.dir(error);
                });
        },
        clickPlayer(name, url) {
            const player = new Howl({
                src: [url],
            });
            player.play();
            player.on('end', function() {
                console.log('Finished!');
                setTimeout(() => {
                    $(`.duration`).width(0);
                    clearInterval(update);
                }, 300)
                return;
            });
            let update = setInterval(() => {
                this.updateWidth(player, name); 
            }, 300);
        },
        updateWidth(player, name) {
            if (player.playing()) {
                let width = (( Number(player.seek().toFixed(1)) / Number(player.duration().toFixed(1)) ) * 100) + '%';
                $(`.${name}_player-duration`).width(width);
            } else {
                this.webaccess.hsieh.state = false;
                this.webaccess.ding.state = false;
                this.webaccess.sun.state = false;
                this.webaccess.hua.state = false;
                this.webaccess.liu.state = false;
                this.webaccess.tsai.state = false;
            }
        },
    }
})
app.mount('#app')
