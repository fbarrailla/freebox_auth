var http = require('http')
var Q = require('q');

module.exports = {
	
	request: function(path, method, headers, content) {
	
		var deferred = Q.defer();

		content = content ? JSON.stringify(content) : '';

		headers = headers || {};	
		headers['Content-Length'] = content.length;
		headers['Content-Type'] = 'application/json';

		var req = http.request({
			host: 'mafreebox.free.fr',
			path: path,
			method: method || 'GET',
			headers: headers
		}, function(resp){
			var data = '';
			resp.on('data', function(chunk) {
	            data += chunk;
	        })
	        resp.on('end', function() {
	            deferred.resolve( JSON.parse(data) )
	        })        
		})

		req.on('error', function(e) {
			console.log('problem with request: ' + e.message);
		});

		req.write( content );
		req.end();	

		return deferred.promise;
	}	
}