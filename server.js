require('dotenv').config({path: __dirname + '/.env'})
const createHookReceiver = require("npm-hook-receiver")
const kafka = require('./kafka')

const producer = kafka.producer()

const main = async()=>{
    await producer.connect()
    const server = createHookReceiver({
        secret: process.env.HOOK_SECRET,
        mount: '/hook'
    })

    server.on("package:publish", async event=>{
        try{
            const responses = await producer.send({
                topic: process.env.TOPIC,
                messages: [{
                    key: event.name,
                value: JSON.stringify({
                    package: event.name,
                    version: event.version
                })
                }]
            })
            console.log('Published message', { responses })
        }
        catch(error){
            console.error('Error publishing message', error)
        
        }
    })

    server.listen(process.env.PORT || 3000, ()=>{
        console.log(`Server listening on port ${process.env.PORT || 3000} `)
    })

}

main()
.catch((err)=>{
    console.error(err)
    process.exit(1)
})