module.exports = {

    // Get HTML Position
    getPosition:function (options) {
        return new Promise(function (resolve, reject) {

            navigator.geolocation.getCurrentPosition(function (position) {
                console.log(typeof (position))
                resolve(position);
            });

        });
    }

}