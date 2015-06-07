var crypto = require('crypto')
var _utils = require('./utils')

var request = _utils.request;

var Auth = function(appId, appToken){
	this._appId = appId;
	this._appToken = appToken
	this._sessionToken = null;
}

Auth.prototype.authenticate = function( callback ){

	var _this = this;
	var requestHeaders = {};

	if (this._sessionToken) {
		requestHeaders['X-Fbx-App-Auth'] = this._sessionToken;
	}

	var proc = request('/api/v3/login/', 'GET', requestHeaders)

		.then(function(data){			
			if (data.result.logged_in) {
				callback( _this._sessionToken );
				proc.end()
			}
			return data.result.challenge;
		})

		.then(function(challenge){	
			return request('/api/v3/login/session/', 'POST', null, {
				app_id: _this._appId,
				password: crypto.createHmac('sha1', _this._appToken).update(challenge).digest('hex')
			})
		})

		.then(function(data){			
			_this._sessionToken = data.result.session_token;
			console.log('new session token: ' + _this._sessionToken);
			callback( _this._sessionToken );
		})
}

module.exports.Auth = Auth;