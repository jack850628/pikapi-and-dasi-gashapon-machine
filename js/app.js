function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

window.onload = function(){
    const IMAGE_MAX_COUNT = 3;
    const OPEN_FREQUENCY = 8;
    const INSIDE_SECOND = 1;
    const CARD_MAX_WIDTH = 112;
    const CARD_MAX_HEIGHT = 112;
    
    const POOL_MAX_WIDTH = 112;
    const POOL_MAX_HEIGHT = 56;

    const IMAGE_STATUS = {
        DOWN: 0,
        UP: 1,
        OPEN: 2
    };
    const CHANGE_DATA_TYPE = {
        POOL: 0,
        CARD: 1
    }

    const PRIZE_LEVEL = {
        [10]: 'N',
        [8]: 'R',
        [6]: 'SR',
        [4]: 'UR',
        [1]: 'SSR'
    };

    const BASE_PRIZES = [
        {
            image: './images/prizes/dasiBAN.gif',
            name: '黨證',
            weight: 1,
        },
        {
            image: './images/prizes/dasiG.png',
            name: '綠帽',
            weight: 10,
        },
        {
            image: './images/prizes/dasiWife.png',
            name: '元元子',
            weight: 6,
        },
        {
            image: './images/prizes/dasiAs.png',
            name: '甲元',
            weight: 10,
        },
        {
            image: './images/prizes/magicg21Gadra.png',
            name: '8bit嘎抓',
            weight: 4,
        },
        {
            image: './images/prizes/magicg21Pinkstarke.png',
            name: '哈哈屁眼',
            weight:10,
        }
    ]
    
    var prizes;
    if(localStorage.prizes){
        prizes = JSON.parse(localStorage.prizes);
    }else{
        prizes = BASE_PRIZES;
        localStorage.setItem('prizes', JSON.stringify(prizes));
    }

    var audioVolume = 10;
    if(localStorage.audioVolume){
        audioVolume = parseInt(localStorage.audioVolume);
    }else{
        localStorage.setItem('audioVolume', audioVolume);
    }

    Vue.createApp({
        data(){
            return {
                IMAGE_STATUS,
                PRIZE_LEVEL,
                prizes,
                audioVolume,

                pools: [],
                cardPoolIndex: -1,

                si: 1,
                previousSi: 0,

                mouxtPreviousY: 0,
                previousSec: 0,
                achieved: 0,
                pastSec: 0,

                prizeIndex: 0,

                imageStatus: null,

                isMouseDowned: false,
                canReset: false,

                closeHint: false,

                isMenuOpen: false,
                isPoolMenuOpen: false,
                isShowLoginScreen: false,
                isShowEditPool: false,
                isShowEditCard: false,
                isShowPaeaseWait: false,
                isShowVolume: false,

                changeImageForObj: null,

                userToken: null,
                userId: null,

                editingPool: {
                    type: CHANGE_DATA_TYPE.POOL,
                    name: '',
                    describe: '',
                    image: '',
                    isPublic: false,
                },
                editingPoolIndex: -1,

                editingCard: {
                    type: CHANGE_DATA_TYPE.CARD,
                    name: '',
                    image: '',
                    weight: '',
                },
                editingCardIndex: -1,
            };
        },
        methods: {
            mouseDown(e){
                this.isMouseDowned = true;
                this.mouxtPreviousY = e.changedTouches? e.changedTouches[0].pageY: e.y;
                this.previousSec = Date.now();
            },
            mouseMove(e){
                if(!this.isMouseDowned || this.imageStatus == IMAGE_STATUS.OPEN) return;
                // console.debug(e);
                let y = e.changedTouches? e.changedTouches[0].pageY: e.y;
                this.si = Math.max(0, Math.min(IMAGE_MAX_COUNT, (this.si + (y - this.mouxtPreviousY) * 0.02)));
                this.mouxtPreviousY = y;

                this.pastSec += Date.now() - this.previousSec;
                this.previousSec = Date.now();
                if(this.pastSec / 1000 > INSIDE_SECOND){
                    console.debug("清");
                    this.achieved = 0;
                    this.pastSec = 0;
                }

                if(this.si == 0){
                    let audioPlayer = null;
                    if(this.previousSi != this.si){
                        audioPlayer = new Audio();
                        audioPlayer.src = './audios/audio1.mp3';
                        audioPlayer.volume = this.audioVolume / 100;
                        audioPlayer.play();
                    }
                    if(this.imageStatus != IMAGE_STATUS.UP){
                        this.imageStatus = IMAGE_STATUS.UP;
                        this.achieved++;
                        console.debug("_達", this.achieved);
                        if(this.achieved >= OPEN_FREQUENCY){
                            audioPlayer = new Audio();
                            audioPlayer.src = './audios/audio2.mp3';
                            audioPlayer.volume = this.audioVolume / 100;
                            audioPlayer.play();
                            this.open();
                        }
                    }
                    audioPlayer?.play();
                }else if(this.si == IMAGE_MAX_COUNT){
                    if(this.previousSi != this.si){
                        let audioPlayer = new Audio();
                        audioPlayer.src = './audios/audio1.mp3';
                        audioPlayer.volume = this.audioVolume / 100;
                        audioPlayer.play();
                    }
                    if(this.imageStatus != IMAGE_STATUS.DOWN){
                        this.imageStatus = IMAGE_STATUS.DOWN;
                        this.achieved++;
                        console.debug("__達", this.achieved);
                    }
                }
                this.previousSi = this.si;
            },
            mouseUp(e){
                this.isMouseDowned = false;
                this.achieved = 0;
                this.pastSec = 0;
            },
            open(){
                var r = Math.random();

                console.debug("開");
                this.imageStatus = IMAGE_STATUS.OPEN;
                setTimeout(() => {
                    let audioPlayer = new Audio();
                    audioPlayer.src = './audios/crrect_answer3.mp3';
                    audioPlayer.volume = this.audioVolume / 100;
                    audioPlayer.play();
                    setTimeout(()=>this.canReset = true, 1000);
                }, 2000)

                console.debug(r, this.prizes);
                
                let p = 0;
                for(let i in this.prizes){
                    p += this.prizes[i].probability;
                    if(p >= r){
                        this.prizeIndex = i;
                        break;
                    }
                }
            },
            reset(){
                if(!this.canReset) return;
                this.canReset = false;
                this.imageStatus = null;
                this.si = 2;
            },
            setWeight(){
                if(this.prizes.length == 0) return;
                var allWeight = this.prizes.map(i => i.weight).reduce((a, b) => a + b);
                this.prizes.forEach(i => i.probability = i.weight / allWeight);
            },
            addPrize(){
                this.prizes.push({
                    image: '',
                    name: '',
                    weight: 10,
                });
                this.$nextTick(function () {
                    listView.scrollTop = listView.scrollHeight;
                })
            },
            imageToChange(obj){
                this.changeImageForObj = obj;
                selectImage.click();
            },
            imageChanged(file){
                file = file.target.files[0];
                if(file){
                    let reader = new FileReader();
                    reader.onloadend = (e) => {
                        var img = document.createElement("img");
                        img.onload = (event) => {
                            var w, h;
                            if(this.changeImageForObj.type == CHANGE_DATA_TYPE.CARD){
                                w = CARD_MAX_WIDTH;
                                h = CARD_MAX_HEIGHT;
                            }else{
                                w = POOL_MAX_WIDTH;
                                h = POOL_MAX_HEIGHT;
                            }
                            var canvas = document.createElement("canvas");
                            if(img.width > img.height){
                                h = w / (img.width / img.height)
                            }else{
                                w = img.width / img.height * h;
                            }
                            console.debug(w, h);
                            canvas.width = w;
                            canvas.height = h;
                            var ctx = canvas.getContext("2d");
                            ctx.drawImage(img, 0, 0, w, h);
                            this.changeImageForObj.image = canvas.toDataURL(file.type);
                            console.debug(this.changeImageForObj.image.length);
                        }
                        img.src = e.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            },
            
            toLogin(){
                this.isShowLoginScreen = true;
            },

            showEditPool(){
                if(this.userId == null){
                    this.toLogin();
                    return;
                }
                this.isShowEditPool = true;
                this.editingPool.name = this.pools[this.editingPoolIndex]?.name ?? ''; 
                this.editingPool.describe = this.pools[this.editingPoolIndex]?.describe ?? '';
                this.editingPool.image = this.pools[this.editingPoolIndex]?.image ?? ''; 
                this.editingPool.isPublic = this.pools[this.editingPoolIndex]?.isPublic ?? false;
            },
            sendPool(){
                this.isShowPaeaseWait = true;
                if(this.editingPoolIndex == -1){
                    CardPool.createPool(
                        this.token,
                        this.editingPool.name,
                        this.editingPool.describe,
                        this.editingPool.image,
                        this.editingPool.isPublic
                    ).catch((e) => {
                        alert('不好意思，發生錯誤了')
                        console.error(e);
                    }).then(result => {
                        this.pools.push({
                            'id': result.message,
                            'name': this.editingPool.name,
                            'describe': this.editingPool.describe,
                            'image': this.editingPool.image,
                            'userId': this.userId,
                            'isPublic': this.editingPool.isPublic
                        })
                    }).finally(() => {
                        this.isShowEditPool = false;
                        this.isShowPaeaseWait = false;
                    });
                    
                }else{
                    CardPool.updatePool(
                        this.token,
                        this.pools[this.editingPoolIndex].id,
                        this.editingPool.name,
                        this.editingPool.describe,
                        this.editingPool.image,
                        this.editingPool.isPublic
                    ).then(result => {
                        this.pools[this.editingPoolIndex].name = this.editingPool.name;
                        this.pools[this.editingPoolIndex].describe = this.editingPool.describe;
                        this.pools[this.editingPoolIndex].image = this.editingPool.image;
                        this.pools[this.editingPoolIndex].isPublic = this.editingPool.isPublic;
                    }).catch((e) => {
                        alert('不好意思，發生錯誤了')
                        console.error(e);
                    }).finally(() => {
                        this.isShowEditPool = false;
                        this.isShowPaeaseWait = false;
                    });
                }
            },
            poolDelete(i){
                if(this.userId == null){
                    this.toLogin();
                    return;
                }
                if(confirm('確定要刪除？')){
                    this.isShowPaeaseWait = true;
                    CardPool.deletePool(this.token, this.pools[i].id).then(result => {
                        this.pools.splice(i, 1);
                    }).catch((e) => {
                        alert('不好意思，發生錯誤了')
                        console.error(e);
                    }).finally(() => {
                        this.isShowPaeaseWait = false;
                    });
                }
            },

            showEditCard(){
                if(this.cardPoolIndex != -1 && this.userId == null){
                    this.toLogin();
                    return;
                }
                this.isShowEditCard = true;
                this.editingCard.name = this.prizes[this.editingCardIndex]?.name ?? ''; 
                this.editingCard.image = this.prizes[this.editingCardIndex]?.image ?? ''; 
                this.editingCard.weight = this.prizes[this.editingCardIndex]?.weight ?? 10;
            },
            sendCard(){
                if(this.cardPoolIndex == -1){
                    if(this.editingCardIndex == -1){
                        this.prizes.push({
                            'name': this.editingCard.name,
                            'image': this.editingCard.image,
                            'weight': this.editingCard.weight,
                        })
                    }else{
                        this.prizes[this.editingCardIndex].name = this.editingCard.name;
                        this.prizes[this.editingCardIndex].image = this.editingCard.image;
                        this.prizes[this.editingCardIndex].weight = this.editingCard.weight;
                    }
                    localStorage.setItem('prizes', JSON.stringify(this.prizes));
                    this.isShowEditCard = false;
                    this.isShowPaeaseWait = false;
                    this.setWeight();
                }else{
                    this.isShowEditCard = true;
                    if(this.editingCardIndex == -1){
                        Card.createCard(
                            this.token,
                            this.editingCard.name,
                            this.editingCard.image,
                            this.editingCard.weight,
                            this.pools[this.cardPoolIndex].id
                        ).catch((e) => {
                            alert('不好意思，發生錯誤了')
                            console.error(e);
                        }).then(result => {
                            this.prizes.push({
                                'id': result.message,
                                'name': this.editingCard.name,
                                'image': this.editingCard.image,
                                'weight': this.editingCard.weight,
                                'userId': this.userId,
                            });
                            this.setWeight();
                        }).finally(() => {
                            this.isShowEditCard = false;
                            this.isShowPaeaseWait = false;
                        });
                        
                    }else{
                        Card.updateCard(
                            this.token,
                            this.prizes[this.editingCardIndex].id,
                            this.editingCard.name,
                            this.editingCard.image,
                            this.editingCard.weight
                        ).catch((e) => {
                            alert('不好意思，發生錯誤了')
                            console.error(e);
                        }).then(result => {
                            this.prizes[this.editingCardIndex].name = this.editingCard.name;
                            this.prizes[this.editingCardIndex].image = this.editingCard.image;
                            this.prizes[this.editingCardIndex].weight = this.editingCard.weight;
                            this.setWeight();
                        }).finally(() => {
                            this.isShowEditCard = false;
                            this.isShowPaeaseWait = false;
                        });
                    }
                }
            },
            cardDelete(i){
                if(this.cardPoolIndex != -1 && this.userId == null){
                    this.toLogin();
                    return;
                }
                if(confirm('確定要刪除？')){
                    if(this.editingCardIndex == -1){
                        this.prizes.splice(i, 1);
                        localStorage.setItem('prizes', JSON.stringify(prizes));
                    }else{
                        this.isShowPaeaseWait = true;
                        Card.deleteCard(this.token, this.prizes[i].id).then(result => {
                            this.prizes.splice(i, 1);
                        }).catch((e) => {
                            alert('不好意思，發生錯誤了')
                            console.error(e);
                        }).finally(() => {
                            this.isShowPaeaseWait = false;
                        });
                    }
                }
            },

            selectedCardPool(i){
                this.cardPoolIndex = i;
                if(i != -1){
                    this.isShowPaeaseWait = true;
                    Card.getAllCards(this.pools[i].id).then((result) => {
                        this.prizes = result;
                        this.setWeight();
                    }).catch((e) => {
                        alert('不好意思，發生錯誤了')
                        console.error(e);
                    }).finally(() => {
                        this.isShowPaeaseWait = false;
                    });
                }else{
                    this.prizes = JSON.parse(localStorage.prizes);
                    this.setWeight();
                }
            },

            onSignIn(googleUser){
                this.token = googleUser.credential;
                this.userId = parseJwt(googleUser.credential).sub;
                this.isShowLoginScreen = false;
                // console.debug(this.token, this.userId);
            }
        },
        watch: {
            // prizes: {
            //     handler(val){
            //         if(val.length > 0){
            //             this.setWeight();
            //             localStorage.setItem('prizes', JSON.stringify(prizes));
            //         }else{
            //             localStorage.removeItem('prizes');
            //         }
            //     },
            //     deep: true
            // },
            audioVolume(val){
                localStorage.setItem('audioVolume', val);
            }
        },
        async mounted(){
            this.setWeight();

            google.accounts.id.initialize({
                client_id: '281999355084-fedtaeh4ngblighrgbk7n84c0k34n4on.apps.googleusercontent.com',
                callback: this.onSignIn,
            })
            google.accounts.id.prompt()
            google.accounts.id.renderButton(
                document.querySelector('#login > div'),
                {
                    type: 'standard',
                    theme: 'filled_black',
                    size: 'large',
                    // text: '從Google登入',
                    shape: 'square',
                    locale: 'zh-TW'
                }
            );

            this.pools = await CardPool.getAllPools();
        }
    }).mount('#app');
}