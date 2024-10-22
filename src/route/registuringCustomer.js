const customerMOdel=require("../controller/customerRegisteration")
const express=require("express")
const router=express.Router()

router.post("/informalRegistery",customerMOdel.registerInformalCustomerModel)
router.post("/formalRegistery", customerMOdel.kiyyaFormalCustomer)
router.post("/branchCustomerRegistery", customerMOdel.uniqueCustomerRegisteration)
router.patch("/kiyyaFormalCustomerUpdate",customerMOdel.formalKiyyaCustomerUpdate)
router.patch("/kiyyaInformalCustomerUpdate",customerMOdel.InformalKiyyaCustomerUpdate)
router.post("/getInformalKiyyaCustomer", customerMOdel.getDisburesedLoanInformalKiyyaCustomer)
router.post("/getNone_loanAccessedInFormalKiyyaCustomer", customerMOdel.getNone_DisburesedLoanInformalKiyyaCustomer)
router.post ("/getFromalKiyyaCustomerAccessedLoan", customerMOdel.getFormalKiyyaCustomerLoanDisbursed)
router.post("/getFromalKiyyaCustomerNotAccessedLoan", customerMOdel.getNone_DisburesedLoanformalKiyyaCustomer)
router.post("/kifiyaData",customerMOdel.registerInformalCustomerModelKifiya)
router.post("/targetAssigned", customerMOdel.targetAssinged)


module.exports=router