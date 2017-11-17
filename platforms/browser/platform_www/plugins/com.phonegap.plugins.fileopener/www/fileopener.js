cordova.define("com.phonegap.plugins.fileopener.FileOpener", function(require, exports, module) { 
module.exports = {

    open: function (url, success, failure) {
        if (!success) {
        	success = function () {
            	console.log("success!");
        	};
        }
        if (!failure) {
        	failure = function (error) {
            	console.log(error);
            };
        }
        cordova.exec(success, failure, "FileOpener", "openFile", [url]);
    }

}

});
