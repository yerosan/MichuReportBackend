const kiyyaModel = require("../models/kiyya_customer");
const ineligibleModel=require("../models/ineligibleKiyya_customer")
const formalCustomerModel = require("../models/womenProduct");
const uniqueCustomerModel = require("../models/uniqueIntersection");
const actualMode = require("../models/actual");
const conversionModel = require("../models/conversionData");
const actualDataModel=require("../models/actualData")
const branchCustomerModels=require("../models/branchCustomer")
const noneCodeCustomer=require("../models/noneCodeCustomerList")
const branchList=require("../models/branch_list")
const convesionCustomer=require("../models/coversionCustomer")
const uniqueCustomer=require("../models/uniqueCustomer")
const { where, Op } = require("sequelize");
const customerListModel = require("../models/customerList");
const { escape } = require("mysql2");
const { QueryTypes } = require('sequelize');
const querys=require("../query/query")
const targetQuery=require("../query/targetQuery")
const kifiyaUrl=require("../config/config")
const axios=require("axios")
const nationalModel=require("../models/nationalData")
const sequelize = require("../db/db");
const { response } = require("express");
const kiyyaCustomerStatus=require("../models/kiyya_customer_status")

const registerInformalCustomerModel = async (req, res) => {
    const dataset= req.body;
    // Utility to format phone number
    function formatPhoneNumber(phoneNumber) {
        if (phoneNumber.startsWith('+251')) {
            return phoneNumber; // No change needed if already with country code
        } else if (phoneNumber.startsWith('0')) {
            return `+251${phoneNumber.substring(1)}`; // Replace leading '0' with '+251'
        }
        return phoneNumber; // Return as is if no changes are needed
    }
    if (!dataset.phone_number || !dataset.account_number || !dataset.initial_working_capital) {
        return res.status(200).json({ message: "All fields are required" });
    }

    try {
      
         dataset.phone_number = formatPhoneNumber(dataset.phone_number);
     

        const [formalCustomer, informalCustomer, prevCustomer, prev_customer] = await Promise.all([
            kiyyaModel.findOne({
                where: {
                    [Op.or]: [
                        { phone_number: dataset.phone_number },
                        { account_number: dataset.account_number }
                    ]
                }
            }),
            formalCustomerModel.findOne({
                where: {
                    [Op.or]: [
                        { phone_number: dataset.phone_number },
                        { account_no: dataset.account_number }
                    ]
                }
            }),
            conversionModel.findOne({
                where: {
                    saving_account: dataset.account_number,
                    product_type: { [Op.in]: ["Women Informal", "Women formal"] }
                }
            }),
            uniqueCustomerModel.findOne({
                where: {
                    saving_account: dataset.account_number,
                    product_type: { [Op.in]: ["Women Informal", "Women formal"] }
                }
            })
        ]);

        // If customer already exists in any of the sources, return conflict error
        if (formalCustomer || informalCustomer || prevCustomer || prev_customer) {
            return res.status(200).json({ message: "Customer already registered" });
        }else{
            // paylod={
            //     "phone_number":dataset.phone_number,
            //     "educational_level":dataset.educational_level,
            //     "account_number":dataset.account_number,
            //     "gender":dataset.gender,
            //     "marital_status":dataset.marital_status,
            //     "date_of_birth":dataset.date_of_birth,
            //     "economic_sector":dataset.economic_sector,
            //     "initial_working_capital":dataset.initial_working_capital,
            //     "source_of_initial_capital":dataset.source_of_initial_capital,
            //     "daily_sales":dataset.daily_sales,
            //     }
            // const payloadData={
            //     "serviceId": 3,
            //     "orgId": "MiQXSS",
            //     dynamicData:paylod
            // }
            // const eligiblityCheck= await axios.post("http://10.12.53.35:8889/api/v1/score", payloadData)
            // if(eligiblityCheck.status==200){
            //     if(eligiblityCheck.data.modelResponse.phoneNumber==dataset.phone_number){
                   
            //         const customerStatus={}
            //         customerStatus.userId=dataset.userId
            //         customerStatus.account_number=dataset.account_number
            //         customerStatus.phone_number=dataset.phone_number
            //         customerStatus.total_score=eligiblityCheck.data.modelResponse.total_score
            //         customerStatus.eligible=eligiblityCheck.data.modelResponse.eligible
            //         if (eligiblityCheck.data.modelResponse.eligible){
                        const registering_customer = await kiyyaModel.create(dataset);
                        // const customer_status= await kiyyaCustomerStatus.create(customerStatus)
                        if (registering_customer) {
                            return res.status(200).json({ message: "Succeed", data: registering_customer });
                        } else {
                            return res.status(200).json({ message: "Unable to register customer" });
                        }
                    // }
                    // else{
                    //     const registering_customer = await ineligibleModel.create(dataset);
                    //     const customer_status= await kiyyaCustomerStatus.create(customerStatus)
                    //     if (registering_customer) {
                    //         return res.status(200).json({ message: "Customer is uneligible for the product due to insufficient customer history.", data: registering_customer });
                    //     } else {
                    //         return res.status(200).json({ message: "Unable to register customer" });
                    //     }
                    // }


                }
        //     }
        // }


    } catch (err) {
        if(err.name==='AxiosError'){
            return res.status(200).json({ message: err.response.data.error});
        }
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(200).json({ message: "Customer with this phone number or account number already exists" });
        }
        console.error("An internal error occurred:", err);  // Log error
        return res.status(500).json({ message: "An internal error occurred" });
    }
};



const nationalId = async (req, res) => {
    try {
      const nationalIdData = req.body;
      const url = kifiyaUrl.kifiyaUrl;
      
      const response = await axios.post(url, nationalIdData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 5000,
      });
      if (response.data) {
        return res.status(200).json({
          data: response.data
        });
      }
    } catch (error) {
      console.error("Error details:", {
        message: error.message,
        code: error.code,
        response: error.response?.data
      });
  
      return res.status(500).json({
        message: "Error processing request",
        error: error.message
      });
    }
  };  


  const NationalIdUser = async (req, res) => {
    try {
      const nationalIdData = req.body;
      const url=kifiyaUrl.kifiyakycUrl
      const response = await axios.post(url, nationalIdData, {
        headers: {
          'Content-Type': 'application/json',
        },
        // timeout: 5000,
      });
      if (response.data) {
        return res.status(200).json({
          data: response.data
        });
      }
    } catch (error) {
      console.error("Error details:", {
        message: error.message,
        code: error.code,
        response: error.response?.data
      });
  
      return res.status(500).json({
        message: "Error processing request",
        error: error.message
      });
    }
  };  



const nationalData=async(req, res)=>{
    const nationalIdData = req.body;

    if(!nationalIdData.nationalId || !nationalIdData.customerPhone){
        return res.status(200).json({message:"National Id and phone number required"})
    }else{
        try{
            nationalModel.sync()
            const response = await nationalModel.create(nationalIdData)
              if (response) {
                return res.status(200).json({
                  message:"Succeed",
                  data: response
                });
              }
        }catch(error){
            console.log("The error", error)
        }
    }

}

const registerInformalCustomerModelKifiya = async (req, res) => {
    const dataset= req.body;
    const formatedData={}
    formatedData.userId='123e4567-e8fb-12d3-a456-42ls141740dm'
    formatedData.fullName=dataset['First Name']+" "+dataset['Father Name']+" "+dataset.Surname
    formatedData.phone_number=dataset['Phone Number']
    formatedData.account_number=dataset['Bank Account Number']
    formatedData.customer_ident_type=dataset['Customer ID Type']
    formatedData.gender=dataset.Gender,
    formatedData.marital_status=dataset['Marital Status'],
    formatedData.date_of_birth=dataset['Date of Birth']
    formatedData.region=dataset.Region
    formatedData.zone_subcity=dataset['Zone/Subcity']
    formatedData.woreda=dataset.Woreda,
    formatedData.educational_level=dataset['Educational Level']
    formatedData.economic_sector=dataset['Economic Sector']
    formatedData.line_of_business=dataset['Line of Business']
    formatedData.initial_working_capital=dataset['Initial Working Capital']
    formatedData.source_of_initial_capital=dataset['Source of Initial Capital']
    formatedData.daily_sales=dataset['Monthly Income'],
    formatedData.purpose_of_loan=dataset['Purpose of Loan']
   

    // Utility to format phone number
    function formatPhoneNumber(phoneNumber) {
        phoneNumber = String(phoneNumber);  
        if (phoneNumber.startsWith('+251')) {
            return phoneNumber;  
        } else if (phoneNumber.startsWith('0')) {
            return `+251${phoneNumber.substring(1)}`;  
        }
         else if (phoneNumber.startsWith('9')) {
            return `+251${phoneNumber}`;  
        }
        else if (phoneNumber.startsWith('7')) {
            return `+251${phoneNumber}`;  
        }
        return phoneNumber;  
    }
    if (!formatedData.phone_number || !formatedData.account_number || !formatedData.initial_working_capital) {
        return res.status(200).json({ message: "All fields are required" });
    }
    try {
      
         formatedData.phone_number = formatPhoneNumber(formatedData.phone_number);
     

        const [formalCustomer, informalCustomer, prevCustomer, prev_customer] = await Promise.all([
            kiyyaModel.findOne({
                where: {
                    [Op.or]: [
                        { phone_number: formatedData.phone_number },
                        { account_number: formatedData.account_number }
                    ]
                }
            }),
            formalCustomerModel.findOne({
                where: {
                    [Op.or]: [
                        { phone_number: formatedData.phone_number },
                        { account_no: formatedData.account_number }
                    ]
                }
            }),
            conversionModel.findOne({
                where: {
                    saving_account: formatedData.account_number,
                    product_type: { [Op.in]: ["Women Informal", "Women formal"] }
                }
            }),
            uniqueCustomerModel.findOne({
                where: {
                    saving_account: formatedData.account_number,
                    product_type: { [Op.in]: ["Women Informal", "Women formal"] }
                }
            })
        ]);

        // If customer already exists in any of the sources, return conflict error
        if (formalCustomer || informalCustomer || prevCustomer || prev_customer) {
            console.log("Customer Found _--")
            return res.status(200).json({ message: "Customer already registered" });

        }else{
        // If no existing customer found, register new customer
            const registering_customer = await kiyyaModel.create(formatedData);

            // If registration succeeds, return success response
            if (registering_customer) {
                return res.status(200).json({ message: "Succeed", data: registering_customer });
            } else {
                return res.status(200).json({ message: "Unable to register customer" });
            }

        }


        
    } catch (err) {
        console.error("An internal error occurred:", err);  // Log error
        return res.status(500).json({ message: "An internal error occurred" });
    }
};


const kiyyaFormalCustomer = async (req, res) => {
    const { phone_number, account_no, ...otherData } = req.body;

    function formatPhoneNumber(phoneNumber) {
        if (phoneNumber.startsWith('+251')) {
            return phoneNumber; 
        } else if (phoneNumber.startsWith('0')) {
            return `+251${phoneNumber.substring(1)}`;  
        }
        return phoneNumber; 
    }

    try {
      
        const formattedPhoneNumber = formatPhoneNumber(phone_number);
            

    
        const [formalCustomer, informalCustomer, prevCustomer, prev_customer] = await Promise.all([
            kiyyaModel.findOne({
                where: {
                    [Op.or]: [
                        { phone_number: formattedPhoneNumber },
                        { account_number: account_no }
                    ]
                }
            }),
            formalCustomerModel.findOne({
                where: {
                    [Op.or]: [
                        { phone_number: formattedPhoneNumber },
                        { account_no }
                    ]
                }
            }),
            conversionModel.findOne({
                where: {
                    saving_account: account_no,
                    product_type: { [Op.in]: ["Women Informal", "Women formal"] }
                }
            }),
            uniqueCustomerModel.findOne({
                where: {
                    saving_account: account_no,
                    product_type: { [Op.in]: ["Women Informal", "Women formal"] }
                }
            })
        ]);

      
        if (formalCustomer || informalCustomer || prevCustomer || prev_customer) {
            return res.status(200).json({ message: "Customer already registered" });
        }else{
                
        
            const registeringCustomer = await formalCustomerModel.create({
                phone_number: formattedPhoneNumber,
                account_no,
                ...otherData  
            });

            if (registeringCustomer) {
                return res.status(200).json({ message: "Succeed", data: registeringCustomer });
            } else {
                return res.status(200).json({ message: "Registration Failed" });
            }
        }


    } catch (err) {
     
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(200).json({ message: "Customer with this phone number or account number already exists" });
        }
        console.error("An internal error occurred:", err);
        return res.status(500).json({ message: "An internal error has occurred." });
    }
};


const uniqueCustomerRegisteration=async(req, res)=>{
    const data=req.body
     
    function formatPhoneNumber(phoneNumber) {
        if (phoneNumber.startsWith('+251')) {
            return phoneNumber;  
        } else if (phoneNumber.startsWith('0')) {
            return `+251${phoneNumber.substring(1)}`; 
        }
        return phoneNumber; 
    }
    
    if (!data.phoneNumber || ! data.Saving_account){
        return res.status(200).json({message:"All field is requied"})
    }else{
        try{
        const formattedPhoneNumber = formatPhoneNumber(data.phoneNumber);
        const [formalCustomer, informalCustomer, prevCustomer, 
            prev_customer, branchCustomer,customer_list,noneCode,
            actualData,conversionCustomer,uniqueCustomers] = await Promise.all([
            kiyyaModel.findOne({
                where: {
                    [Op.or]: [
                        { phone_number: formattedPhoneNumber },
                        { account_number: data.Saving_account }
                    ]
                }
            }),
            formalCustomerModel.findOne({
                where: {
                    [Op.or]: [
                        { phone_number: formattedPhoneNumber },
                        { account_no :data.Saving_account}
                    ]
                }
            }),
            conversionModel.findOne({
                where: {
                    saving_account: data.Saving_account,
                }
            }),
            uniqueCustomerModel.findOne({
                where: {
                    saving_account: data.Saving_account,
                }
            }),

            branchCustomerModels.findOne({
                where: {
                    [Op.or]: [
                        { phoneNumber: formattedPhoneNumber },
                        { Saving_Account :data.Saving_account}
                    ]
                }
            }),
            customerListModel.findOne({
                where: {
                    [Op.or]: [
                        { phone_number: formattedPhoneNumber },
                        { saving_account :data.Saving_account}
                    ]
                }
            }),
            noneCodeCustomer.findOne({
                where: {
                    [Op.or]: [
                        { phone_number: formattedPhoneNumber },
                        { saving_account :data.Saving_account}
                    ]
                }
            }),
            uniqueCustomer.findOne({
                where: {
                    [Op.or]: [
                        { phoneNumber: formattedPhoneNumber },
                        { Saving_Account :data.Saving_account}
                    ]
                }
                
            }),
            convesionCustomer.findOne({
                where: {
                    [Op.or]: [
                        { phoneNumber: formattedPhoneNumber },
                        { Saving_Account :data.Saving_account}
                    ]
                }
            }),

            actualDataModel.findOne({
                where: {
                    saving_account: data.Saving_account,
                }
            })


        ]);

        if (formalCustomer || informalCustomer || prevCustomer || prev_customer || branchCustomer ||customer_list || noneCode ||
            actualData ||conversionCustomer||uniqueCustomers){
                return res.status(200).json({ message: "Customer already registered" })
            }
            else{
                     
                    data.Saving_Account=data.Saving_account
                    data.phoneNumber=formattedPhoneNumber
                    const registeringCustomer = await branchCustomerModels.create(data);

                    if (registeringCustomer) {
                          
                        return res.status(200).json({ message: "Succeed", data: registeringCustomer });
                    } else {
                        return res.status(200).json({ message: "Unable to register customer" });
                    }
            }


        }catch(err){
             
            if (err.name === 'SequelizeUniqueConstraintError') {
                return res.status(200).json({ message: "Customer with this phone number or account number already exists" });
            }
            console.log("Error:",err)
            return res.status(500).json({message:"An internal error has occurred."})
        }
    }




}



const InformalKiyyaCustomerUpdate=async(req, res)=>{
   const updatedData=req.body
      
     if (!updatedData.phone_number || !updatedData.account_number || !updatedData.initial_working_capital) {
       return res.status(200).json({ message: "All fields are required" });
        }

        try {
        
            
        

            const [informalCustomer,formalCustomer, prevCustomer, prev_customer] = await Promise.all([
                kiyyaModel.findAll({
                    where: {
                        [Op.or]: [
                            { phone_number: updatedData.phone_number },
                            { account_number: updatedData.account_number }
                        ]
                    }
                }),
                formalCustomerModel.findOne({
                    where: {
                        [Op.or]: [
                            { phone_number: updatedData.phone_number },
                            { account_no: updatedData.account_number }
                        ]
                    }
                }),
                conversionModel.findOne({
                    where: {
                        saving_account: updatedData.account_number,
                        product_type: { [Op.in]: ["Women Informal", "Women formal"] }
                    }
                }),
                uniqueCustomerModel.findOne({
                    where: {
                        saving_account: updatedData.account_number,
                        product_type: { [Op.in]: ["Women Informal", "Women formal"] }
                    }
                })
            ]);

            // If customer already exists in any of the sources, return conflict error
            if ((informalCustomer && informalCustomer.length>1) || formalCustomer|| prevCustomer || prev_customer) {
                return res.status(200).json({ message: "The provided information is already in use." });
            }

            // If no existing customer found, register new customer
            const updatingData = await kiyyaModel.update(updatedData, {where:{kiyya_id:updatedData.dataValues.kiyya_id}});

            
            if (updatingData) {
                return res.status(200).json({ message: "Succeed", data: updatingData });
            } else {
                return res.status(200).json({ message: "Data update failed." });
            }
            
        } catch (err) {
            console.error("An internal error occurred:", err);  // Log error
            return res.status(500).json({ message: "An internal error has occurred." });
        }

}



const getDisburesedLoanInformalKiyyaCustomer = async (req, res) => {
    const fetchingparameters=req.body
    const page = parseInt(fetchingparameters.page) || 1;
    const limit = parseInt(fetchingparameters.limit) || 10;
    const offset = (page - 1) * limit;
    const catagory=fetchingparameters.catagory
    const user_role=fetchingparameters.user_role
    const userId=fetchingparameters.userId
    const search=fetchingparameters.search

    try {
        const query = catagory.length >0 ? querys.loanRecivedQueryPeruserFiltering:querys.loanRecivedQueryPeruser;

        const kiyya_customerWithLoans = await sequelize.query(query, {
            replacements: { 
                user_role,
                userId,
                search:search || null,  // Use `null` if phone_number is not provided
                limit, 
                offset,
                catagory
            },
            type: QueryTypes.SELECT
        });

        // Count total records for pagination
        const totalCountQuery =catagory.length>0 ? querys.totalLoanRecivedCountQuerysFiltering:querys.totalLoanRecivedCountQuerys;

        const totalCountResult = await sequelize.query(totalCountQuery, {
            replacements: { 
                user_role,
                userId,
                catagory },
            type: QueryTypes.SELECT
        });

        const totalRecords = totalCountResult[0].totalCount;
        const totalPages = Math.ceil(totalRecords / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        return res.status(200).json({
            message: "Succeed",
            data: kiyya_customerWithLoans,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalRecords: totalRecords,
                nextPage: hasNextPage ? page + 1 : null,
                prevPage: hasPrevPage ? page - 1 : null,
                hasNextPage: hasNextPage,
                hasPrevPage: hasPrevPage,
            },
        });
    } catch (error) {
        console.error("Error fetching customers with loans:", error);
        return res.status(500).json({ message: "An internal error has occurred." });
    }
};



const getNone_DisburesedLoanInformalKiyyaCustomer = async (req, res) => {
    const fetchingparameters=req.body
    const page = parseInt(fetchingparameters.page) || 1;
    const limit = parseInt(fetchingparameters.limit) || 10;
    const offset = (page - 1) * limit;
    const catagory=fetchingparameters.catagory
    const user_role=fetchingparameters.user_role
    const userId=fetchingparameters.userId
    const search=fetchingparameters.search

    try {
        const query = catagory.length>0 ? querys.None_loan_accessedCustomerFiltering:querys.None_loan_accessedCustomer;

        const kiyya_customerWithLoans = await sequelize.query(query, {
            replacements: { 
                user_role,
                userId,
                search:search || null,  // Use `null` if phone_number is not provided
                limit, 
                offset,
                catagory
            },
            type: QueryTypes.SELECT
        });

        const totalCountQuery =catagory.length>0 ? querys.tolalInformalCustomer_withOutLoanFiltering:querys.tolalInformalCustomer_withOutLoan;

        const totalCountResult = await sequelize.query(totalCountQuery, {
            replacements: { 
                user_role,
                userId,
                catagory },
            type: QueryTypes.SELECT
        });

        const totalRecords = totalCountResult[0].totalCount;
        const totalPages = Math.ceil(totalRecords / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        return res.status(200).json({
            message: "Succeed",
            data: kiyya_customerWithLoans,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalRecords: totalRecords,
                nextPage: hasNextPage ? page + 1 : null,
                prevPage: hasPrevPage ? page - 1 : null,
                hasNextPage: hasNextPage,
                hasPrevPage: hasPrevPage,
            },
        });
    } catch (error) {
        console.error("Error fetching customers with loans:", error);
        return res.status(500).json({ message: "An internal error has occurred." });
    }
};







const getFormalKiyyaCustomerLoanDisbursed = async (req, res) => {
    const fetchingparameters=req.body
    const page = parseInt(fetchingparameters.page) || 1;
    const limit = parseInt(fetchingparameters.limit) || 10;
    const offset = (page - 1) * limit;
    const catagory=fetchingparameters.catagory
    const user_role=fetchingparameters.user_role
    const userId=fetchingparameters.userId
    const search=fetchingparameters.search
    try {
        const query = catagory.length > 0 ? querys.loanRecivedQueryPeruserForFormalKiyyaCustomerFiltering:querys.loanRecivedQueryPeruserForFormalKiyyaCustomer;

        const kiyya_customerWithLoans = await sequelize.query(query, {
            replacements: { 
                user_role,
                userId,
                search: search || null,  // Use `null` if account_no is not provided
                limit, 
                offset,
                catagory},
            type: QueryTypes.SELECT
        });

        // Count total records for pagination
        const totalCountQuery =catagory.length > 0 ? querys.totalFormalKiyyaCustomerLoanRecivedFiltering:querys.totalFormalKiyyaCustomerLoanRecived;

        const totalCountResult = await sequelize.query(totalCountQuery, {
            replacements: { 
                user_role,
                userId,
                catagory },
            type: QueryTypes.SELECT
        });

        const totalRecords = totalCountResult[0].totalCount;
        const totalPages = Math.ceil(totalRecords / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        return res.status(200).json({
            message: "Succeed",
            data: kiyya_customerWithLoans,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalRecords: totalRecords,
                nextPage: hasNextPage ? page + 1 : null,
                prevPage: hasPrevPage ? page - 1 : null,
                hasNextPage: hasNextPage,
                hasPrevPage: hasPrevPage,
            },
        });
    } catch (error) {
        console.error("Error fetching customers with loans:", error);
        return res.status(500).json({ message: "An internal error has occurred." });
    }
};






const getNone_DisburesedLoanformalKiyyaCustomer = async (req, res) => {
    const fetchingparameters=req.body
    const page = parseInt(fetchingparameters.page) || 1;
    const limit = parseInt(fetchingparameters.limit) || 10;
    const offset = (page - 1) * limit;
    const catagory=fetchingparameters.catagory
    const user_role=fetchingparameters.user_role
    const userId=fetchingparameters.userId
    const search=fetchingparameters.search
    try {
        const query =catagory.length>0 ? querys.noneLoanAccessedFormalKiyyaCustomerFiltering:querys.noneLoanAccessedFormalKiyyaCustomer;

        const kiyya_customerWithLoans = await sequelize.query(query, {
            replacements: { 
                user_role,
                userId,
                search: search || null,  // Use `null` if account_no is not provided
                // phone_number: phone_number || null,  // Use `null` if phone_number is not provided
                limit, 
                offset,
                catagory
            },
            type: QueryTypes.SELECT
        });

        // Count total records for pagination
        const totalCountQuery =catagory.length>0 ? querys.totalkiyyaFromalCustomer_withoutLoanFiltering:querys.totalkiyyaFromalCustomer_withoutLoan;

        const totalCountResult = await sequelize.query(totalCountQuery, {
            replacements: { 
                user_role,
                userId,
                catagory },
            type: QueryTypes.SELECT
        });

        const totalRecords = totalCountResult[0].totalCount;
        const totalPages = Math.ceil(totalRecords / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        return res.status(200).json({
            message: "Succeed",
            data: kiyya_customerWithLoans,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalRecords: totalRecords,
                nextPage: hasNextPage ? page + 1 : null,
                prevPage: hasPrevPage ? page - 1 : null,
                hasNextPage: hasNextPage,
                hasPrevPage: hasPrevPage,
            },
        });
    } catch (error) {
        console.error("Error fetching customers with loans:", error);
        return res.status(500).json({ message: "An internal error has occurred." });
    }
};



const formalKiyyaCustomerUpdate=async(req, res)=>{
    updatedData=req.body
    try {
        // Format phone number
        // const formattedPhoneNumber = formatPhoneNumber(phone_number);
            

        // Query to check if the customer already exists
        const [informalCustomer,formalCustomer, prevCustomer, prev_customer] = await Promise.all([
            kiyyaModel.findOne({
                where: {
                    [Op.or]: [
                        { phone_number: updatedData.phone_number },
                        { account_number: updatedData.account_no }
                    ]
                }
            }),
            formalCustomerModel.findAll({
                where: {
                    [Op.or]: [
                        { phone_number: updatedData.phone_number },
                        { account_no: updatedData.account_no }
                    ]
                }
            }),
            conversionModel.findOne({
                where: {
                    saving_account: updatedData.account_no,
                    product_type: { [Op.in]: ["Women Informal", "Women formal"] }
                }
            }),
            uniqueCustomerModel.findOne({
                where: {
                    saving_account: updatedData.account_no,
                    product_type: { [Op.in]: ["Women Informal", "Women formal"] }
                }
            })
        ]);

        // Check if the customer exists in any model
        if (informalCustomer || (formalCustomer && formalCustomer.length >1) || prevCustomer || prev_customer) {
            return res.status(200).json({ message: "The provided information is already in use." });
        }

        // Register the customer if not found
        const formal_customerUpdate = await formalCustomerModel.update(
            updatedData,{where:{wpc_id:updatedData.wpc_id}}
        );

        if (formal_customerUpdate) {
            return res.status(200).json({ message: "Succeed", data: formal_customerUpdate });
        } else {
            return res.status(200).json({ message: "Data update failed." });
        }

    } catch (err) {
        console.error("An internal error occurred:", err);
        return res.status(500).json({ message: "An internal error has occurred." });
    }
    }
   




    const targetAssinged = async (req, res) => {
        const fetchingparameters=req.body
        const catagory=fetchingparameters.catagory
        const user_role=fetchingparameters.role
        const userId=fetchingparameters.userId
        const district=fetchingparameters.district
        const branch_code=fetchingparameters.branch_code


        try {;
            const query=targetQuery.targetQuery
            const totalActualCountQuery =querys.totalFormalKiyyaCustomerLoanRecived
            const totalActualInformalquery=querys.totalLoanRecivedCountQuerys
            const totalCountResult = await sequelize.query(query, {
                replacements: { 
                    user_role,
                    userId,
                    district,
                    branch_code,
                    catagory },
                type: QueryTypes.SELECT
            });

            const totalActualCountResult = await sequelize.query(totalActualCountQuery, {
                replacements: { 
                    user_role,
                    userId,
                    catagory },
                type: QueryTypes.SELECT
            });

            const totalActualInformalCountResult = await sequelize.query(totalActualInformalquery, {
                replacements: { 
                    user_role,
                    userId,
                    catagory },
                type: QueryTypes.SELECT
            });

            const totalActualRecords = totalActualCountResult[0].totalCount;
            const totalActualInformalRecords = totalActualInformalCountResult[0].totalCount;
            const totalRecords = totalCountResult[0].total_target;
            // const hasNextPage = page < totalPages;
            // const hasPrevPage = page > 1;
    
            return res.status(200).json({
                message: "Succeed",
                data:{
                totalTarget:totalRecords,
                totalActualRecord:totalActualRecords,
                totalActualInformal:totalActualInformalRecords
                }
            });
        } catch (error) {
            console.error("Error fetching customers with loans:", error);
            return res.status(500).json({ message: "An internal error has occurred." });
        }
    };
    


module.exports={registerInformalCustomerModel, kiyyaFormalCustomer,
                uniqueCustomerRegisteration,InformalKiyyaCustomerUpdate,
                formalKiyyaCustomerUpdate, getDisburesedLoanInformalKiyyaCustomer,
                getNone_DisburesedLoanInformalKiyyaCustomer,getFormalKiyyaCustomerLoanDisbursed,
                getNone_DisburesedLoanformalKiyyaCustomer,
                registerInformalCustomerModelKifiya,targetAssinged,
                nationalId, NationalIdUser,nationalData
            }