const kafka = require('./kafka')
const { IncomingWebhook } = require("@slack/webhook")
const slack  = new IncomingWebhook(process.env.SLACK_INCOMING_WEBHOOK)

const consumer = kafka.consumer({
    groupId: process.env.GROUP_ID
})

const main = async ()=>{
    await consumer.connect()

    await consumer.subscribe({
        topic: process.env.TOPIC,
        fromBeginning: true
    })

    await consumer.run({
        eachMessage: async({ topic, partition, message}) =>{

            console.log('Received Message', {
                topic,
                partition,
                key: message.key.toString(),
                value: message.value.toString()
            })

            const { package, version } = JSON.parse(message.value.toString());

            const text = `:package: ${package}@${version} released\n<https://www.npmjs.com/package/${package}/v/${version}|Check it out on NPM>`;
            await slack.send({
                text,
                username: 'Rydr Package Monitoring'
            })
        }
    })
}

main()
.catch(async error=>{
    console.log(error)
    try{
        await consumer.disconnect()
    }
    catch(e){
        console.error('Failed to disconnect consumer', e)
    }
    process.exit(1)
})