module.exports = {

    // Get HTML Position
    getPosition:function (options) {
        return new Promise(function (resolve, reject) {

            navigator.geolocation.getCurrentPosition(function (position) {
                console.log(typeof (position))
                resolve(position);
            });

        });
    },

    itemExists:function (name) {

        return new Promise((resolve, reject) => {
            Event.find({ name: name }).limit(1)
                .then((result) => {
                    if (result.length > 0) {
                        resolve(true);
                    } else {
                        resolve(false)
                    }
                })
        })

    }

}