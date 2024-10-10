const express=require("express")
const cors=require("cors")
const appUrl=require("./src/config/config")
const userRoute=require("./src/route/userRoute")
// const roleRoute=require("./src/route/roleRoute")
app=express()

app.use(express.json())
const michuReport= require("./src/db/db")

michuReport.authenticate().then(()=>{
    michuReport.sync().then(()=>{
        console.log("db is successfully synced")
    })
}).catch(error=>{
    console.log("An internal error",error)
})

app.use(cors({
    origin: `${appUrl}`, 
    credentials: true 
})

);
app.use("/user", userRoute)
// app.use("/collection", collectionRoute)
// app.use("/role", roleRoute)
// app.use("/salse", salseRouter)
// app.use("/operational", operationalRouter)

app.listen(3000, ()=>{
    console.log("app is listening in port 3000")
})









// yerosant@10.101.200.140
// The authenticity of host '10.101.200.140 (10.101.200.140)' can't be established.
// ED25519 key fingerprint is SHA256:sOJiRa2tM3wiWwxRfbX9xcxNKD9BJl/4GeKPYPfqS0g.
// This key is not known by any other names
// Are you sure you want to continue connecting (yes/no/[fingerprint])?



// The authenticity of host '10.101.200.141 (10.101.200.141)' can't be established.
// ED25519 key fingerprint is SHA256:sOJiRa2tM3wiWwxRfbX9xcxNKD9BJl/4GeKPYPfqS0g.
// This host key is known by the following other names/addresses:
//     C:\Users\Coop/.ssh/known_hosts:5: 10.101.200.140
// Are you sure you want to continue connecting (yes/no/[fingerprint])? y
// Please type 'yes', 'no' or the fingerprint: yes