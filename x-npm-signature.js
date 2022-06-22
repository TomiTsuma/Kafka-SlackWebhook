const crypto = require('crypto')


var body = '{"event":"package:publish","name":"@kafkajs/zstd","version":"1.0.0","hookOwner":{"username":"nevon"},"payload":{"name":"@kafkajs/zstd"},"change":{"version":"1.0.0"},"time":1603444214995}'
var expected = crypto.createHmac('sha256', "12345678").update(body).digest('hex');
console.log(expected)