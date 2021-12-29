const express = require('express')
const http = require('http')
const Aws = require('aws-sdk')
const app = express()//express initialiation
const server = http.createServer(app)
app.use(express.json())
Aws.config.region = 'ap-southeast-1'
const docClient = new Aws.DynamoDB.DocumentClient();
const ORGID = "6745524f"

app.get('/subjectsGet', async (req, res) => {
    try {
        const params = {
            TableName: "subjects"
        }
        const result = await docClient.scan(params).promise()
        console.log(result);
        res.status(200).send(result)
    }
    catch (error) {
        console.log(error)
    }
})

app.post('/subjectsPost', async (req, res) => {
    try {
        const params = {
            TableName: "subjects",
            Item: {
                pk: `#ORG${ORGID}`,
                sk: `#METADATA#${ORGID}`,
                sName: "MATHS",
                grade: "A"
            }
        }
        const result = await docClient.put(params).promise()
        console.log(result);
        res.status(200).send(result)
    }
    catch (error) {
        console.log(error)
    }
})

app.put('/subjectsNameupdate/:pkid/:skid/:sName',async(req,res)=>{    //   http://localhost:2000/subjectsNameupdate/ORG6745565769f/6745565769f/Tamil
    try{
            const result = await docClient.update({
            TableName:"subjects",
            Key:{
                pk: `#${req.params.pkid}`,
                sk: `#METADATA#${req.params.skid}`
            },
            
            UpdateExpression: "set #sName = :sName",
            ExpressionAttributeNames: {"#sName":"sName"},
            ExpressionAttributeValues: {":sName":req.params.sName}   // take care of this one parames name.
    }).promise()
        console.log(result);
        res.status(200).send(result)
}
    catch(error)
    {
        console.log(error)
    }
})

app.delete('/subjectsdelete/:pkid/:skid', async (req, res) => {   //if we delete or get  particular item in the table pk and sk is mandatory
    try {
        const params = {
            TableName: "subjects",
            Key: {
                pk: `#${req.params.pkid}`,
                sk: `#METADATA#${req.params.skid}`
            }
        }
        const result = await docClient.delete(params).promise()
        console.log(result);
        res.status(200).send(result)
    }
    catch (error) {
        console.log(error)
    }
})
server.listen(2000, () => {
    console.log('server started')
})
