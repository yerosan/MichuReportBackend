const express=require("express")
const cors=require("cors")
const appUrl=require("./src/config/config")
const userRoute=require("./src/route/userRoute")
const customerRegisterRoute=require("./src/route/registuringCustomer")
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
app.use("/customer",customerRegisterRoute)
// app.use("/collection", collectionRoute)
// app.use("/role", roleRoute)
// app.use("/salse", salseRouter)
// app.use("/operational", operationalRouter)

app.listen(3000, ()=>{
    console.log("app is listening in port 3000")
})
