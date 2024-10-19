const kiyyaModel = require("../models/kiyya_customer");
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

const sequelize = require("../db/db");
// const Sequelize=require("sequelize")
const registerInformalCustomerModel = async (req, res) => {
    const dataset= req.body;


    console.log("Dataset_____---------",dataset)


    // Utility to format phone number
    function formatPhoneNumber(phoneNumber) {
        if (phoneNumber.startsWith('+251')) {
            return phoneNumber; // No change needed if already with country code
        } else if (phoneNumber.startsWith('0')) {
            return `+251${phoneNumber.substring(1)}`; // Replace leading '0' with '+251'
        }
        return phoneNumber; // Return as is if no changes are needed
    }

    // Validation: Ensure all required fields are provided
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
        }

        // If no existing customer found, register new customer
        const registering_customer = await kiyyaModel.create(dataset);

        // If registration succeeds, return success response
        if (registering_customer) {
            return res.status(200).json({ message: "Succeed", data: registering_customer });
        } else {
            return res.status(200).json({ message: "Unable to register customer" });
        }
        
    } catch (err) {
        console.error("An internal error occurred:", err);  // Log error
        return res.status(500).json({ message: "An internal error occurred" });
    }
};


const kiyyaFormalCustomer = async (req, res) => {
    const { phone_number, account_no, ...otherData } = req.body;

    // Utility to format phone number
    function formatPhoneNumber(phoneNumber) {
        if (phoneNumber.startsWith('+251')) {
            return phoneNumber; // No change needed if already with country code
        } else if (phoneNumber.startsWith('0')) {
            return `+251${phoneNumber.substring(1)}`; // Replace leading '0' with '+251'
        }
        return phoneNumber; // Return as is if no changes are needed
    }

    try {
        // Format phone number
        const formattedPhoneNumber = formatPhoneNumber(phone_number);
            

        // Query to check if the customer already exists
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

        // Check if the customer exists in any model
        if (formalCustomer || informalCustomer || prevCustomer || prev_customer) {
            return res.status(200).json({ message: "Customer already registered" });
        }

        // Register the customer if not found
        const registeringCustomer = await formalCustomerModel.create({
            phone_number: formattedPhoneNumber,
            account_no,
            ...otherData // Add remaining data from req.body
        });

        if (registeringCustomer) {
            return res.status(200).json({ message: "Succeed", data: registeringCustomer });
        } else {
            return res.status(200).json({ message: "Registration Failed" });
        }

    } catch (err) {
        console.error("An internal error occurred:", err);
        return res.status(500).json({ message: "An internal error has occurred." });
    }
};


const uniqueCustomerRegisteration=async(req, res)=>{
    const data=req.body
    // Utility to format phone number
    function formatPhoneNumber(phoneNumber) {
        if (phoneNumber.startsWith('+251')) {
            return phoneNumber; // No change needed if already with country code
        } else if (phoneNumber.startsWith('0')) {
            return `+251${phoneNumber.substring(1)}`; // Replace leading '0' with '+251'
        }
        return phoneNumber; // Return as is if no changes are needed
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

        if (formalCustomer || informalCustomer ||prevCustomer, 
            prev_customer || branchCustomer ||customer_list,noneCode,
            actualData ||conversionCustomer||uniqueCustomers){
                return res.status(200).json({ message: "Customer already registered" })
            }
            else{
                    // Register the customer if not found
                    data.Saving_Account=data.Saving_account
                    const registeringCustomer = await branchCustomerModels.create(data);

                    if (registeringCustomer) {
                        return res.status(200).json({ message: "Succeed", data: registeringCustomer });
                    } else {
                        return res.status(200).json({ message: "Unable to register customer" });
                    }
            }


        }catch(err){
            console.log("Error:",err)
            return res.status(500).json({message:"An internal error has occurred."})
        }
    }




}



const InformalKiyyaCustomerUpdate=async(req, res)=>{
   const updatedData=req.body


   // Validation: Ensure all required fields are provided
     if (!updatedData.phone_number || !updatedData.account_number || !updatedData.initial_working_capital) {
       return res.status(200).json({ message: "All fields are required" });
        }

        try {
        
            // dataset.phone_number = formatPhoneNumber(dataset.phone_number);
        

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

            // If registration succeeds, return success response
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


const paginateModel = async (model, page, limit, whereCondition = {}) => {
    const offset = (page - 1) * limit;

    // Run both queries concurrently: fetching data and counting total records
    const [data, totalRecords] = await Promise.all([
        model.findAll({
            where: whereCondition, // Optional: to filter data if needed
            limit: limit,
            offset: offset,
        }),
        model.count({
            where: whereCondition,
        }),
    ]);

    const totalPages = Math.ceil(totalRecords / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
        data,
        pagination: {
            currentPage: page,
            totalPages: totalPages,
            totalRecords: totalRecords,
            nextPage: hasNextPage ? page + 1 : null,
            prevPage: hasPrevPage ? page - 1 : null,
            hasNextPage: hasNextPage,
            hasPrevPage: hasPrevPage,
        },
    };
};



// const getInformalCustomer = async (req, res) => {
//     const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
//     const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page

//     // Calculate the starting index for pagination
//     const offset = (page - 1) * limit;

//     try {
//         // Fetch data with pagination using Sequelize's findAll
//         const [informalCustomers, totalCustomers] = await Promise.all ([
//             kiyyaModel.findAll({
//                     limit: limit,
//                     offset: offset,
//                 }),
//             kiyyaModel.count()])

//         // Count the total number of customers (useful for pagination metadata)
//         // const totalCustomers = await 

//         if (informalCustomers.length > 0) {
//             return res.status(200).json({
//                 message: "Succeed",
//                 data: informalCustomers,
//                 pagination: {
//                     currentPage: page,
//                     totalPages: Math.ceil(totalCustomers / limit),
//                     totalCustomers,
//                 },
//             });
//         } else {
//             return res.status(200).json({ message: "Data doesn't exist" });
//         }
//     } catch (error) {
//         console.error("Error fetching informal customers:", error);
//         return res.status(500).json({ message: "An internal error has occurred." });
//     }
// };


// const getInformalKiyyaCustomer = async (req, res) => {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;

//     try {
//         // Use the paginate utility for the informalCustomerModel
//         const result = await paginateModel(kiyyaModel, page, limit);

//         if (result.data.length > 0) {
//             return res.status(200).json({
//                 message: "Succeed",
//                 data: result.data,
//                 pagination: result.pagination,
//             });
//         } else {
//             return res.status(200).json({ message: "Data doesn't exist" });
//         }
//     } catch (error) {
//         console.error("Error fetching informal customers:", error);
//         return res.status(500).json({ message: "An internal error has occurred." });
//     }
// };



const getCustomersWithLoans = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
        const query = `
            SELECT customers.*, COUNT(disbursed_loans.id) as loans_count
            FROM customers
            INNER JOIN disbursed_loans ON customers.accountId = disbursed_loans.accountId
            GROUP BY customers.id
            LIMIT :limit OFFSET :offset;
        `;

        const customersWithLoans = await sequelize.query(query, {
            replacements: { limit, offset },
            type: QueryTypes.SELECT
        });

        // Assuming we also need to fetch the total count for pagination:
        const totalCountQuery = `
            SELECT COUNT(DISTINCT customers.id) as totalCount
            FROM customers
            INNER JOIN disbursed_loans ON customers.accountId = disbursed_loans.accountId;
        `;

        const totalCountResult = await sequelize.query(totalCountQuery, {
            type: QueryTypes.SELECT
        });

        const totalRecords = totalCountResult[0].totalCount;
        const totalPages = Math.ceil(totalRecords / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        return res.status(200).json({
            message: "Succeed",
            data: customersWithLoans,
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


const getDisburesedLoanInformalKiyyaCustomer = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // 'SOUTH FINFINE',"Bethel Branch"
    const catagory=['CENTRAL FINFINE','EASTERN FINFINE'];
    const user_role="Branch User";
    const userId="570eb243-2581-11ef-be93-0a8448ae1c4d";
    const account_number="";
    const phone_number="";


    try {
        const query = catagory.length >0 ? querys.loanRecivedQueryPeruserFiltering:querys.loanRecivedQueryPeruser;

        const kiyya_customerWithLoans = await sequelize.query(query, {
            replacements: { 
                user_role,
                userId,
                account_number: account_number || null,  // Use `null` if account_no is not provided
                phone_number: phone_number || null,  // Use `null` if phone_number is not provided
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const catagory=['CENTRAL FINFINE','EASTERN FINFINE'];
    const user_role="Branch User";
    const userId="570eb243-2581-11ef-be93-0a8448ae1c4d";
    const account_number="";
    const phone_number="";

    try {
        const query = catagory.length>0 ? querys.None_loan_accessedCustomerFiltering:querys.None_loan_accessedCustomer;

        const kiyya_customerWithLoans = await sequelize.query(query, {
            replacements: { 
                user_role,
                userId,
                account_number: account_number || null,  // Use `null` if account_no is not provided
                phone_number: phone_number || null,  // Use `null` if phone_number is not provided
                limit, 
                offset,
                catagory
            },
            type: QueryTypes.SELECT
        });

        // Count total records for pagination
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
// 'SOUTH FINFINE',"Bethel Branch"
    const catagory=['CENTRAL FINFINE','EASTERN FINFINE'];
    const user_role="Branch User";
    const userId="570eb243-2581-11ef-be93-0a8448ae1c4d";
    const account_no="";
    const phone_number="";
    try {
        const query = catagory.length > 0 ? querys.loanRecivedQueryPeruserForFormalKiyyaCustomerFiltering:querys.loanRecivedQueryPeruserForFormalKiyyaCustomer;

        const kiyya_customerWithLoans = await sequelize.query(query, {
            replacements: { 
                user_role,
                userId,
                account_no: account_no || null,  // Use `null` if account_no is not provided
                phone_number: phone_number || null,  // Use `null` if phone_number is not provided
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const catagory=['CENTRAL FINFINE','EASTERN FINFINE'];
    const user_role="Branch User";
    const userId="570eb243-2581-11ef-be93-0a8448ae1c4d";
    const account_no="";
    const phone_number="";
    try {
        const query =catagory.length>0 ? querys.noneLoanAccessedFormalKiyyaCustomerFiltering:querys.noneLoanAccessedFormalKiyyaCustomer;

        const kiyya_customerWithLoans = await sequelize.query(query, {
            replacements: { 
                user_role,
                userId,
                account_no: account_no || null,  // Use `null` if account_no is not provided
                phone_number: phone_number || null,  // Use `null` if phone_number is not provided
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




module.exports={registerInformalCustomerModel, kiyyaFormalCustomer,
                uniqueCustomerRegisteration,InformalKiyyaCustomerUpdate,
                formalKiyyaCustomerUpdate, getDisburesedLoanInformalKiyyaCustomer,
                getNone_DisburesedLoanInformalKiyyaCustomer,getFormalKiyyaCustomerLoanDisbursed,
                getNone_DisburesedLoanformalKiyyaCustomer
            }