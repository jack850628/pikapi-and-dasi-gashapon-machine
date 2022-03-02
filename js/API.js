const API_PROTOCOL = 'https';
const API_HOST = 'pdgm.jack.origthatone.com';
const API_POST = '443';
const API_URL = `${API_PROTOCOL}://${API_HOST}:${API_POST}/api`;

class CardPool{
        static prefix = 'cardPool'
        static getAllPools() {
            return fetch(`${API_URL}/${CardPool.prefix}/`).then((result) => {
                if(!result.ok) throw Error(result.json())
                return result.json()
            });
        }

        static getPool(poolId) {
            return fetch(`${API_URL}/${CardPool.prefix}/${poolId}`).then((result) => {
                if(!result.ok) throw Error(result.json())
                return result.json()
            });
        }

        static  createPool(token, name, describe, image, isPublic) {
            var data = new FormData();
            data.append('name', name);
            data.append('describe', describe);
            data.append('image', image);
            data.append('isPublic', isPublic);

            return fetch(`${API_URL}/${CardPool.prefix}/create`, {
                method: 'PUT',
                body: data,
                headers: new Headers({
                    'user-token': token
                })
            }).then((result) => {
                if(!result.ok) throw Error(result.json())
                return result.json()
            });
        }

        static updatePool(token, poolId, name, describe, image, isPublic) {
            var data = new FormData();
            data.append('name', name);
            data.append('describe', describe);
            data.append('image', image);
            data.append('isPublic', isPublic);

            return fetch(`${API_URL}/${CardPool.prefix}/${poolId}`, {
                method: 'POST',
                body: data,
                headers: new Headers({
                    'user-token': token
                })
            }).then((result) => {
                if(!result.ok) throw Error(result.json())
                return result.json()
            });
        }

        static deletePool(token, poolId) {
            return fetch(`${API_URL}/${CardPool.prefix}/${poolId}`, {
                method: 'DELETE',
                body: null,
                headers: new Headers({
                    'user-token': token
                })
            }).then((result) => {
                if(!result.ok) throw Error(result.json())
                return result.json()
            });
        }
}

class Card{
    static prefix = 'card'
    static getAllCards(poolId) {
        return fetch(`${API_URL}/${Card.prefix}/all/${poolId}`).then((result) => {
            if(!result.ok) throw Error(result.json())
            return result.json()
        });
    }

    static getCard(cardId) {
        return fetch(`${API_URL}/${Card.prefix}/${cardId}`).then((result) => {
            if(!result.ok) throw Error(result.json())
            return result.json()
        });
    }

    static async createCard(token, name, image, weight, cardPoolId) {
        var data = new FormData();
        data.append('name', name);
        data.append('image', image);
        data.append('weight', weight);
        data.append('cardPoolId', cardPoolId);

        return fetch(`${API_URL}/${Card.prefix}/create`, {
            method: 'PUT',
            body: data,
            headers: new Headers({
                'user-token': token
            })
        }).then((result) => {
            if(!result.ok) throw Error(result.json())
            return result.json()
        });
    }

    static updateCard(token, cardId, name, image, weight) {
        var data = new FormData();
        data.append('name', name);
        data.append('image', image);
        data.append('weight', weight);

        return fetch(`${API_URL}/${Card.prefix}/${cardId}`, {
            method: 'POST',
            body: data,
            headers: new Headers({
                'user-token': token
            })
        }).then((result) => {
            if(!result.ok) throw Error(result.json())
            return result.json()
        });
    }

    static deleteCard(token, cardId) {
        return fetch(`${API_URL}/${Card.prefix}/${cardId}`, {
            method: 'DELETE',
            body: null,
            headers: new Headers({
                'user-token': token
            })
        }).then((result) => {
            if(!result.ok) throw Error(result.json())
            return result.json()
        });
    }
}