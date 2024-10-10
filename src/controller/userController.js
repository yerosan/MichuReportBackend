const userModel=require("../models/userModel")
const userInfoModel=require("../models/user_info")
const crmUserModel=require("../models/crm_user")
const crmlistModel=require("../models/crm_list")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const dotenv=require("dotenv")

const crypto = require('crypto');

// Function to hash the password with SHA-256
function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

// const { get } = require("../route/collectionRoute")
const { where } = require("sequelize")
const roleListModel = require("../models/role_list")
dotenv.config()
function createAccessToken(userName){
    return jwt.sign(userName,process.env.security_key,{expiresIn:"86400s"})
}
const registerUser= async (req,res)=>{
     const userData=req.body
     const password=userData.password
     if(!userData.password || !userData.confirmation || !userData.fullName || !userData.userName || !userData.role){
        res.status(200).json({message:"All field are required"})
     }else{
     try{
        userModel.sync()
        const user= await userModel.findOne({where:{userName:userData.userName}})
        if(user){
            res.status(200).json({message:"User already exist"})
         }
        else{
            let checkPassword= userData.password===userData.confirmation
            if(checkPassword){
            let payload={userName:userData.userName}
            let hashePassword=await bcrypt.hash(password, 10) 
            const createUser=await userModel.create({
                    userName:userData.userName,
                    fullName:userData.fullName,
                    password:hashePassword,
                    })
            if(createUser){
                const token=createAccessToken(payload)
                createUser.dataValues.token=token
                res.status(201).json({message:"succed", data:createUser})
            }else{
                res.status(404).send("Unable to connect to db")
            }
          }else{
            res.status(200).json({message:"Password doesn't much"})
          }
        }
     }catch(error){
        res.status(500).json({message:"An internal error"})
        console.log("An internal error", error)
     }
    }
}
// const loginUser=async(req, res)=>{
//     const data=req.body
//     if (!data.userName || !data.password){
//         res.status(200).json({message:"All field are required"})
//     }else{
//         try{
//             const user= await userInfoModel.findOne({where:{userName:data.userName}})
//             if(user){
//                 if(await bcrypt.compare(data.password,user.dataValues.password)){
//                     payload={userName:user.dataValues.userName}
//                     let token=createAccessToken(payload)
//                     user.dataValues.token=token
//                     res.status(200).json({message:"succeed",data:user})
//                 }else{
//                     res.status(200).json({message:"Incorrect password"})
//                 }
//             }else{
//                 res.status(200).json({message:"User not found please register"})
//             }

//         }catch(erro){
//             res.status(500).json({message:"An internal error"})
//             console.log("An internal error", erro)
//         }
//     }
// }



// const loginUser = async (req, res) => {
//     const data = req.body;
//     if (!data.userName || !data.password) {
//         res.status(200).json({ message: "All fields are required" });
//     } else {
//         try {
//             const user = await userInfoModel.findOne({ where: { userName: data.userName } });
//             const crmUser= await crmUserModel.findOne({where: {  username: data.userName }})
//             if (user) {
//                 const hashedPassword = hashPassword(data.password); // Hash the password
//                 if (hashedPassword === user.dataValues.password) { // Compare hashed passwords
//                     const payload = { userName: user.dataValues.userName };
//                     const roles= await roleListModel.findOne({where:{role_Id:user.dataValues.role}})
//                     console.log("These role_-----------", roles)
//                     if (roles){
//                         let token = createAccessToken(payload);
//                         user.dataValues.roleName=roles.dataValues.role
//                         user.dataValues.token = token;
//                         res.status(200).json({ message: "succeed", data: user });
//                     }else{
//                         res.status(200).json({message:"Unable to access role"})
//                     }
//                 } else {
//                     res.status(200).json({ message: "Incorrect password" });
//                 }
//             } 
//             else if(crmUser){
//                 const hashedPassword = hashPassword(data.password); // Hash the password
//                 if (hashedPassword === crmUser.dataValues.crm_password) { // Compare hashed passwords
//                     const payload = { userName: crmUser.dataValues.username };
//                     const crm_roles= await crmlistModel.findOne({where:{employe_id:crmUser.dataValues.employe_id}})
//                     console.log("These role_-----------", crm_roles)
//                     if (crm_roles){
//                         let token = createAccessToken(payload);
//                         crmUser.dataValues.fullName=crm_roles.dataValues.full_name
//                         crmUser.dataValues.roleName=crm_roles.dataValues.role
//                         crmUser.dataValues.token = token;
//                         res.status(200).json({ message: "succeed", data: crmUser });
//                     }else{
//                         res.status(200).json({message:"Unable to access role"})
//                     }
//                 } else {
//                     res.status(200).json({ message: "Incorrect password" });
//                 }

//             }
//             else {
//                 res.status(200).json({ message: "User not found, please register" });
//             }
//         } catch (error) {
//             res.status(500).json({ message: "An internal error occurred" });
//             console.log("An internal error", error);
//         }
//     }
// };



const loginUser = async (req, res) => {
    const { userName, password } = req.body;

    // Validation: Check if both username and password are provided
    if (!userName || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Query user info and CRM user in parallel
        const [user, crmUser] = await Promise.all([
            userInfoModel.findOne({ where: { userName } }),
            crmUserModel.findOne({ where: { username: userName } })
        ]);

        const hashedPassword = hashPassword(password); // Hash the password once

        // If user is found in the main user info system
        if (user) {
            console.log("The user_inf0 uer_____-")
            // Compare hashed passwords
            if (hashedPassword === user.dataValues.password) {
                const payload = { userName: user.dataValues.userName };

                // Find role for the user
                const roles = await roleListModel.findOne({ where: { role_Id: user.dataValues.role } });

                if (roles) {
                    const token = createAccessToken(payload);
                    return res.status(200).json({
                        message: "succeed",
                        data: {
                            ...user.dataValues,
                            roleName: roles.dataValues.role,
                            token
                        }
                    });
                } else {
                    return res.status(403).json({ message: "Unable to access role" });
                }
            } else {
                return res.status(401).json({ message: "Incorrect password" });
            }
        }

        // If user is found in CRM system
        if (crmUser) {
            console.log("The role uer_____-" )
            if (hashedPassword === crmUser.dataValues.crm_password) {
                const payload = { userName: crmUser.dataValues.username };

                // Find role for the CRM user
                const crmRoles = await crmlistModel.findOne({ where: { employe_id: crmUser.dataValues.employe_id } });

                if (crmRoles) {
                    const token = createAccessToken(payload);
                    return res.status(200).json({
                        message: "succeed",
                        data: {
                            ...crmUser.dataValues,
                            fullName: crmRoles.dataValues.full_name,
                            roleName: crmRoles.dataValues.role,
                            token
                        }
                    });
                } else {
                    return res.status(403).json({ message: "Unable to access role" });
                }
            } else {
                return res.status(401).json({ message: "Incorrect password" });
            }
        }

        // If no user is found in either system
        return res.status(404).json({ message: "User not found, please register" });
        
    } catch (error) {
        console.error("An internal error occurred:", error); // Logging the error
        return res.status(500).json({ message: "An internal error occurred" });
    }
};


const addUser = async(req, res)=>{
    const userDatas=req.body
    if (! userDatas.userName || ! userDatas.password || !userDatas.role){
        res.status(400).json({message:"All field is required"})
    }else{
      try{
        const user= await userModel.findOne({where:{userName:userDatas.userName}})
        if(user){
            res.status(403).json({message:"User already exist"})
        }else{
            const hashedPassword = await bcrypt.hash(userDatas.password,10)
            createUser= await userModel.create({userName:userDatas.userName,password:hashedPassword,role:userDatas.role})
            if(createUser){
                res.status(200).json({message:"User created",data:createUser})
            }
        }
      }catch(err){
        console.log("An error",err)
        res.status(200).json({message:"An internal error"})
      }
    }
}

const getUser=async(req, res)=>{
    try{
        let users=await userModel.findAll()
        if(users.length>0){
            res.status(200).json({message:"succeed", data:users})
        }else{
            res.status(200).json({message:"User data not found"})
        }
    }catch(error){
        res.status(500).json({message:"Some thing went wrong"})
        console.log("this is userError", error)
    }
}

const changePassword= async(req, res)=>{
    previData=req.body
    if (!previData.userName|| !previData.oldPassword || !previData.newPassword || !previData.confirmation){
        res.status(200).json({message:"All field is required"})
    }else{
    try{
        await userModel.sync()
        let user= await userModel.findOne({where:{userName:previData.userName}})
        if(user){
            if(await bcrypt.compare(previData.oldPassword,user.dataValues.password)){
               if(previData.newPassword===previData.confirmation){
                  let hasheNewPassword= await bcrypt.hash(previData.newPassword, 10) 
                  let update= await userModel.update({password:hasheNewPassword}, {where:{userId:user.dataValues.userId}})
                  if(update){
                    res.status(200).json({message:"succeed", data:update})
                  }else{
                    res.status(200).json({message:"Unable to change password"})
                  }
               }else{
                res.status(200).json({message:"Make sure your new password match"})
               }
               
            }else{
                res.status(200).json({message:"Old password is incorrect"})
            }
        }else{
            res.status(200).json({message:"Unable to find user"})
        }
    }catch(error){
        console.log("The error", error)
        res.status(200).json({message:"An internal error"})
    }
}
}

module.exports={registerUser,loginUser,changePassword,addUser, getUser}
