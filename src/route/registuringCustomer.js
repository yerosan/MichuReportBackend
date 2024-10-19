const customerMOdel=require("../controller/customerRegisteration")
const express=require("express")
const router=express.Router()

router.post("/informalRegistery",customerMOdel.registerInformalCustomerModel)
router.post("/formalRegistery", customerMOdel.kiyyaFormalCustomer)
router.post("/branchCustomerRegistery", customerMOdel.uniqueCustomerRegisteration)
router.patch("/kiyyaFormalCustomerUpdate",customerMOdel.formalKiyyaCustomerUpdate)
router.patch("/kiyyaInformalCustomerUpdate",customerMOdel.InformalKiyyaCustomerUpdate)
router.get("/getInformalKiyyaCustomer", customerMOdel.getDisburesedLoanInformalKiyyaCustomer)
router.get("/getNone_loanAccessedInFormalKiyyaCustomer", customerMOdel.getNone_DisburesedLoanInformalKiyyaCustomer)
router.get ("/getFromalKiyyaCustomerAccessedLoan", customerMOdel.getFormalKiyyaCustomerLoanDisbursed)
router.get("/getFromalKiyyaCustomerNotAccessedLoan", customerMOdel.getNone_DisburesedLoanformalKiyyaCustomer)


module.exports=router