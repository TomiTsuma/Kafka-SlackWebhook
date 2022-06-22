require('dotenv').config({path: __dirname + '/.env'})
const { Kafka } = require('kafkajs')

const { KAFKA_USERNAME : username, KAFKA_PASSWORD: password } = process.env
const sasl = username && password ? { username, password, mechanism: 'plain'}: null
const ssl = !!sasl

const kafka = new Kafka({
    clientId : 'npm-slack-notifier',
    brokers: [process.env.KAFKA_BOOTSTRAP_SERVER],
    ssl,
    sasl
})

module.exports = kafka