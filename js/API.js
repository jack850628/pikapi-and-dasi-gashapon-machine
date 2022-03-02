const API_PROTOCOL = 'https';
const API_HOST = 'pdgm.jack.origthatone.com';
const API_POST = '443';
const API_URL = `${API_PROTOCOL}://${API_HOST}:${API_POST}/api`;

class CardPool{
        static prefix = 'cardPool'
        static async getAllPools() {
            return (await fetch(`${API_URL}/${CardPool.prefix}/`)).json();
        }

        static async getPool(poolId) {
            return (await fetch(`${API_URL}/${CardPool.prefix}/${poolId}`)).json();
        }

        static async createPool(token, name, describe, image, isPublic) {
            var data = new FormData();
            data.append('name', name);
            data.append('describe', describe);
            data.append('image', image);
            data.append('isPublic', isPublic);

            return (await fetch(`${API_URL}/${CardPool.prefix}/create`, {
                method: 'PUT',
                body: data,
                headers: new Headers({
                    'user-token': token
                })
            })).json();
        }

        static async updatePool(token, poolId, name, describe, image, isPublic) {
            var data = new FormData();
            data.append('name', name);
            data.append('describe', describe);
            data.append('image', image);
            data.append('isPublic', isPublic);

            return (await fetch(`${API_URL}/${CardPool.prefix}/${poolId}`, {
                method: 'POST',
                body: data,
                headers: new Headers({
                    'user-token': token
                })
            })).json();
        }

        static async deletePool(token, poolId) {
            return (await fetch(`${API_URL}/${CardPool.prefix}/${poolId}`, {
                method: 'DELETE',
                body: null,
                headers: new Headers({
                    'user-token': token
                })
            })).json();
        }
}

class Card{
    static prefix = 'card'
    static async getAllCards(poolId) {
        return (await fetch(`${API_URL}/${Card.prefix}/all/${poolId}`)).json();
    }

    static async getCard(cardId) {
        return (await fetch(`${API_URL}/${Card.prefix}/${cardId}`)).json();
    }

    static async createCard(token, name, image, weight, cardPoolId) {
        var data = new FormData();
        data.append('name', name);
        data.append('image', image);
        data.append('weight', weight);
        data.append('cardPoolId', cardPoolId);

        return (await fetch(`${API_URL}/${Card.prefix}/create`, {
            method: 'PUT',
            body: data,
            headers: new Headers({
                'user-token': token
            })
        })).json();
    }

    static async updateCard(token, cardId, name, image, weight) {
        var data = new FormData();
        data.append('name', name);
        data.append('image', image);
        data.append('weight', weight);

        return (await fetch(`${API_URL}/${Card.prefix}/${cardId}`, {
            method: 'POST',
            body: data,
            headers: new Headers({
                'user-token': token
            })
        })).json();
    }

    static async deleteCard(token, cardId) {
        return (await fetch(`${API_URL}/${Card.prefix}/${cardId}`, {
            method: 'DELETE',
            body: null,
            headers: new Headers({
                'user-token': token
            })
        })).json();
    }
}