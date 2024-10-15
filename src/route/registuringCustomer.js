const customerMOdel=require("../controller/customerRegisteration")
const express=require("express")
const router=express.Router()

router.post("/informalRegistery",customerMOdel.registerInformalCustomerModel )
router.post("/formalRegistery", customerMOdel.kiyyaFormalCustomer)
router.post("/branchCustomerRegistery", customerMOdel.uniqueCustomerRegisteration)


module.exports=router