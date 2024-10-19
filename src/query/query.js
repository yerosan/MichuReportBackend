const { getDisburesedLoanInformalKiyyaCustomer } = require("../controller/customerRegisteration")

const loanRecivedQueryPeruser=`
    WITH filtered_conversiondata AS (
        SELECT saving_account, branch_code 
        FROM conversiondata
        WHERE Product_Type IN ('Women Informal', 'Women Formal')
        AND disbursed_date >= '2024-10-01'
        AND saving_account NOT IN (
            SELECT saving_account
            FROM conversiondata
            WHERE Product_Type IN ('Women Informal', 'Women Formal')
            AND disbursed_date < '2024-10-01'
        )
    ),
    filtered_unique_intersection AS (
        SELECT saving_account, branch_code 
        FROM unique_intersection
        WHERE Product_Type IN ('Women Informal', 'Women Formal')
        AND disbursed_date >= '2024-10-01'
        AND saving_account NOT IN (
            SELECT saving_account
            FROM unique_intersection
            WHERE Product_Type IN ('Women Informal', 'Women Formal')
            AND disbursed_date < '2024-10-01'
        )
    )
    SELECT DISTINCT 
        kiyya_customer.kiyya_id, 
        kiyya_customer.account_number, 
        kiyya_customer.phone_number, 
        kiyya_customer.fullName,
        COALESCE(user_infos.full_name, crm_list.full_name) AS recruiter_name,  
        COALESCE(user_infos.district, crm_list.sub_process) As catagory,
        COALESCE(user_infos.district, crm_list.department) as supervice,
        COALESCE(filtered_conversiondata.branch_code, filtered_unique_intersection.branch_code) AS branch_code , -- Return branch_code;
        branch_list.branch_name,
        district_list.district_name,
        kiyya_customer.registered_date
    FROM kiyya_customer
    LEFT JOIN filtered_conversiondata 
        ON kiyya_customer.account_number = filtered_conversiondata.saving_account
    LEFT JOIN filtered_unique_intersection 
        ON kiyya_customer.account_number = filtered_unique_intersection.saving_account
    LEFT JOIN user_infos 
        ON kiyya_customer.userId = user_infos.userId  
    LEFT JOIN crm_user
        ON kiyya_customer.userId = crm_user.crm_id 
    LEFT JOIN crm_list
        ON crm_user.employe_id = crm_list.employe_id 

    LEFT JOIN branch_list 
        ON COALESCE(filtered_conversiondata.branch_code, filtered_unique_intersection.branch_code) = branch_list.branch_code
    LEFT JOIN district_list 
        ON branch_list.dis_Id = district_list.dis_Id

    WHERE kiyya_customer.userId != '1cc2ceef-fc07-44b9-9696-86d734d1dd59'
    AND kiyya_customer.registered_date >= '2024-10-01'

    
        -- Role-based filtering
    AND (
        :user_role = 'Admin'  -- Admin can access all records
        OR 
        (   -- Branch user can only access records within their branch
            :user_role = 'Branch User'
            AND kiyya_customer.userId = :userId
        )
    )

    -- Dynamic filters based on input
    -- Search by account_no if provided
    AND (
        :account_number IS NULL OR kiyya_customer.account_number = :account_number
      )

    -- Search by phone_number if provided
    AND (
        :phone_number IS NULL OR kiyya_customer.phone_number = :phone_number
    )


    AND NOT EXISTS (
        SELECT 1
        FROM kiyya_customer AS kc
        WHERE kc.account_number = kiyya_customer.account_number
        AND kc.registered_date < '2024-10-01'
    )
    AND NOT EXISTS (
        SELECT 1
        FROM kiyya_customer AS kc
        WHERE kc.phone_number = kiyya_customer.phone_number
        AND kc.registered_date < '2024-10-01'
    )
    AND (
        filtered_conversiondata.saving_account IS NOT NULL 
        OR filtered_unique_intersection.saving_account IS NOT NULL
    )
    LIMIT :limit OFFSET :offset;
`


const loanRecivedQueryPeruserFiltering=`
    WITH filtered_conversiondata AS (
        SELECT saving_account, branch_code 
        FROM conversiondata
        WHERE Product_Type IN ('Women Informal', 'Women Formal')
        AND disbursed_date >= '2024-10-01'
        AND saving_account NOT IN (
            SELECT saving_account
            FROM conversiondata
            WHERE Product_Type IN ('Women Informal', 'Women Formal')
            AND disbursed_date < '2024-10-01'
        )
    ),
    filtered_unique_intersection AS (
        SELECT saving_account, branch_code 
        FROM unique_intersection
        WHERE Product_Type IN ('Women Informal', 'Women Formal')
        AND disbursed_date >= '2024-10-01'
        AND saving_account NOT IN (
            SELECT saving_account
            FROM unique_intersection
            WHERE Product_Type IN ('Women Informal', 'Women Formal')
            AND disbursed_date < '2024-10-01'
        )
    )
    SELECT DISTINCT 
        kiyya_customer.kiyya_id, 
        kiyya_customer.account_number, 
        kiyya_customer.phone_number, 
        kiyya_customer.fullName,
        COALESCE(user_infos.full_name, crm_list.full_name) AS recruiter_name,  
        COALESCE(user_infos.district, crm_list.sub_process) As catagory,
        COALESCE(user_infos.district, crm_list.department) as supervice,
        COALESCE(filtered_conversiondata.branch_code, filtered_unique_intersection.branch_code) AS branch_code , -- Return branch_code;
        branch_list.branch_name,
        district_list.district_name,
        kiyya_customer.registered_date
    FROM kiyya_customer
    LEFT JOIN filtered_conversiondata 
        ON kiyya_customer.account_number = filtered_conversiondata.saving_account
    LEFT JOIN filtered_unique_intersection 
        ON kiyya_customer.account_number = filtered_unique_intersection.saving_account
    LEFT JOIN user_infos 
        ON kiyya_customer.userId = user_infos.userId  
    LEFT JOIN crm_user
        ON kiyya_customer.userId = crm_user.crm_id 
    LEFT JOIN crm_list
        ON crm_user.employe_id = crm_list.employe_id 

    LEFT JOIN branch_list 
        ON COALESCE(filtered_conversiondata.branch_code, filtered_unique_intersection.branch_code) = branch_list.branch_code
    LEFT JOIN district_list 
        ON branch_list.dis_Id = district_list.dis_Id

    WHERE kiyya_customer.userId != '1cc2ceef-fc07-44b9-9696-86d734d1dd59'
    AND kiyya_customer.registered_date >= '2024-10-01'
    


    -- Role-based filtering
    AND (
        :user_role = 'Admin'  -- Admin can access all records
        OR 
        (   -- Branch user can only access records within their branch
            :user_role = 'Branch User'
            AND kiyya_customer.account_number = :userId
        )
    )

    -- Dynamic filters based on input
    -- Search by account_no if provided
    AND (
        :account_number IS NULL OR kiyya_customer.account_number = :account_number
    )

    -- Search by phone_number if provided
    AND (
        :phone_number IS NULL OR kiyya_customer.phone_number = :phone_number
    )

    AND (
        COALESCE(user_infos.full_name, crm_list.full_name) IN (:catagory)  -- Dynamic category filter (supports a list)
        OR
        COALESCE(user_infos.district, crm_list.sub_process) IN (:catagory)  -- Dynamic category filter (supports a list)
    )
    AND NOT EXISTS(
        SELECT 1
        FROM kiyya_customer AS kc
        WHERE kc.account_number = kiyya_customer.account_number
        AND kc.registered_date < '2024-10-01'
    )
    AND NOT EXISTS (
        SELECT 1
        FROM kiyya_customer AS kc
        WHERE kc.phone_number = kiyya_customer.phone_number
        AND kc.registered_date < '2024-10-01'
    )
    AND (
        filtered_conversiondata.saving_account IS NOT NULL 
        OR filtered_unique_intersection.saving_account IS NOT NULL
    )
    LIMIT :limit OFFSET :offset;
`



const None_loan_accessedCustomer=`
        WITH filtered_conversiondata AS (
            -- Filter conversiondata for October based on Product_Type and disbursed_date >= '2024-10-01'
            SELECT saving_account
            FROM conversiondata
            WHERE Product_Type IN ('Women Informal', 'Women Formal')
            -- AND disbursed_date >= '2024-10-01'
        ),
        filtered_unique_intersection AS (
            -- Filter unique_intersection for October based on Product_Type and disbursed_date >= '2024-10-01'
            SELECT saving_account
            FROM unique_intersection
            WHERE Product_Type IN ('Women Informal', 'Women Formal')
        )
        SELECT DISTINCT 
            kiyya_customer.kiyya_id, 
            kiyya_customer.fullName,
            kiyya_customer.account_number, 
            kiyya_customer.phone_number, 
            kiyya_customer.initial_working_capital,
            COALESCE(user_infos.full_name, crm_list.full_name) AS recruiter_name,  
            COALESCE(user_infos.district, crm_list.sub_process) As catagory,
            COALESCE(user_infos.district, crm_list.department) as supervice,
            kiyya_customer.registered_date
        FROM kiyya_customer
        LEFT JOIN user_infos 
            ON kiyya_customer.userId = user_infos.userId  
        LEFT JOIN crm_user
            ON kiyya_customer.userId = crm_user.crm_id 
        LEFT JOIN crm_list
        ON crm_user.employe_id = crm_list.employe_id 
        WHERE kiyya_customer.registered_date >= '2024-10-01'
        AND kiyya_customer.userId != '1cc2ceef-fc07-44b9-9696-86d734d1dd59'

        
        -- Role-based filtering
        AND (
            :user_role = 'Admin'  -- Admin can access all records
            OR 
            (   -- Branch user can only access records within their branch
                :user_role = 'Branch User'
                AND kiyya_customer.userId = :userId
            )
        )

        -- Dynamic filters based on input
        -- Search by account_no if provided
        AND (
            :account_number IS NULL OR kiyya_customer.account_number = :account_number
        )

        -- Search by phone_number if provided
        AND (
            :phone_number IS NULL OR kiyya_customer.phone_number = :phone_number
        )
        -- Check that the customer is not found in conversiondata by account_number or phone_number
        AND NOT EXISTS (
            SELECT 1
            FROM filtered_conversiondata fcd
            WHERE fcd.saving_account = kiyya_customer.account_number
            -- OR fcd.phone_number = kc.phone_number
        )
        -- Check that the customer is not found in unique_intersection by account_number or phone_number
        AND NOT EXISTS (
            SELECT 1
            FROM filtered_unique_intersection fui
            WHERE fui.saving_account = kiyya_customer.account_number
            -- OR fui.phone_number = kc.phone_number
        )

        LIMIT :limit OFFSET :offset;
`


const None_loan_accessedCustomerFiltering=`
        WITH filtered_conversiondata AS (
            -- Filter conversiondata for October based on Product_Type and disbursed_date >= '2024-10-01'
            SELECT saving_account
            FROM conversiondata
            WHERE Product_Type IN ('Women Informal', 'Women Formal')
            -- AND disbursed_date >= '2024-10-01'
        ),
        filtered_unique_intersection AS (
            -- Filter unique_intersection for October based on Product_Type and disbursed_date >= '2024-10-01'
            SELECT saving_account
            FROM unique_intersection
            WHERE Product_Type IN ('Women Informal', 'Women Formal')
        )
        SELECT DISTINCT 
            kiyya_customer.kiyya_id, 
            kiyya_customer.fullName,
            kiyya_customer.account_number, 
            kiyya_customer.phone_number, 
            kiyya_customer.initial_working_capital,
            COALESCE(user_infos.full_name, crm_list.full_name) AS recruiter_name,  
            COALESCE(user_infos.district, crm_list.sub_process) As catagory,
            COALESCE(user_infos.district, crm_list.department) as supervice,
            kiyya_customer.registered_date
        FROM kiyya_customer
        LEFT JOIN user_infos 
            ON kiyya_customer.userId = user_infos.userId  
        LEFT JOIN crm_user
            ON kiyya_customer.userId = crm_user.crm_id 
        LEFT JOIN crm_list
        ON crm_user.employe_id = crm_list.employe_id 
        WHERE kiyya_customer.registered_date >= '2024-10-01'
        AND kiyya_customer.userId != '1cc2ceef-fc07-44b9-9696-86d734d1dd59'
        AND kiyya_customer.registered_date >= '2024-10-01'

        
        -- Role-based filtering
        AND (
            :user_role = 'Admin'  -- Admin can access all records
            OR 
            (   -- Branch user can only access records within their branch
                :user_role = 'Branch User'
                AND kiyya_customer.userId = :userId
            )
        )

        -- Dynamic filters based on input
        -- Search by account_no if provided
        AND (
            :account_number IS NULL OR kiyya_customer.account_number = :account_number
        )

        -- Search by phone_number if provided
        AND (
            :phone_number IS NULL OR kiyya_customer.phone_number = :phone_number
        )
            
        AND (
            COALESCE(user_infos.full_name, crm_list.full_name) IN (:catagory)  -- Dynamic category filter (supports a list)
            OR
            COALESCE(user_infos.district, crm_list.sub_process) IN (:catagory)  -- Dynamic category filter (supports a list)
        )
        -- Check that the customer is not found in conversiondata by account_number or phone_number
        AND NOT EXISTS (
            SELECT 1
            FROM filtered_conversiondata fcd
            WHERE fcd.saving_account = kiyya_customer.account_number
            -- OR fcd.phone_number = kc.phone_number
        )
        -- Check that the customer is not found in unique_intersection by account_number or phone_number
        AND NOT EXISTS (
            SELECT 1
            FROM filtered_unique_intersection fui
            WHERE fui.saving_account = kiyya_customer.account_number
            -- OR fui.phone_number = kc.phone_number
        )

        LIMIT :limit OFFSET :offset;
`

const totalLoanRecivedCountQuerys=`
    WITH filtered_conversiondata AS (
        -- Filtered conversiondata based on Product_Type and disbursed_date >= '2024-10-01'
        SELECT saving_account
        FROM conversiondata
        WHERE Product_Type IN ('Women Informal', 'Women Formal')
        AND disbursed_date >= '2024-10-01'
        AND saving_account NOT IN (
            SELECT saving_account
            FROM conversiondata
            WHERE Product_Type IN ('Women Informal', 'Women Formal')
            AND disbursed_date < '2024-10-01'
        )
    ),
    filtered_unique_intersection AS (
        SELECT saving_account
        FROM unique_intersection
        WHERE Product_Type IN ('Women Informal', 'Women Formal')
        AND disbursed_date >= '2024-10-01'
        AND saving_account NOT IN (
            SELECT saving_account
            FROM unique_intersection
            WHERE Product_Type IN ('Women Informal', 'Women Formal')
            AND disbursed_date < '2024-10-01'
        )
    )
    SELECT COUNT(DISTINCT kiyya_customer.kiyya_id) as totalCount
    FROM kiyya_customer
    LEFT JOIN filtered_conversiondata 
        ON kiyya_customer.account_number = filtered_conversiondata.saving_account
    LEFT JOIN filtered_unique_intersection 
        ON kiyya_customer.account_number = filtered_unique_intersection.saving_account
    LEFT JOIN user_infos
        ON kiyya_customer.userId = user_infos.userId
    LEFT JOIN crm_user
        ON kiyya_customer.userId = crm_user.crm_id 
    LEFT JOIN crm_list
        ON crm_user.employe_id = crm_list.employe_id
    WHERE kiyya_customer.userId != '1cc2ceef-fc07-44b9-9696-86d734d1dd59'
    AND kiyya_customer.registered_date >= '2024-10-01'

    
        -- Role-based filtering
    AND (
        :user_role = 'Admin'  -- Admin can access all records
        OR 
        (   -- Branch user can only access records within their branch
            :user_role = 'Branch User'
            AND women_product_customer.crm_id = :userId
        )
    )

    AND NOT EXISTS (
        SELECT 1
        FROM kiyya_customer AS kc
        WHERE kc.account_number = kiyya_customer.account_number
        AND kc.registered_date < '2024-10-01'
    )
    AND NOT EXISTS (
        SELECT 1
        FROM kiyya_customer AS kc
        WHERE kc.phone_number = kiyya_customer.phone_number
        AND kc.registered_date < '2024-10-01'
    )
    AND (
        filtered_conversiondata.saving_account IS NOT NULL 
        OR filtered_unique_intersection.saving_account IS NOT NULL
    )
        
`




const totalLoanRecivedCountQuerysFiltering=`
    WITH filtered_conversiondata AS (
        -- Filtered conversiondata based on Product_Type and disbursed_date >= '2024-10-01'
        SELECT saving_account
        FROM conversiondata
        WHERE Product_Type IN ('Women Informal', 'Women Formal')
        AND disbursed_date >= '2024-10-01'
        AND saving_account NOT IN (
            SELECT saving_account
            FROM conversiondata
            WHERE Product_Type IN ('Women Informal', 'Women Formal')
            AND disbursed_date < '2024-10-01'
        )
    ),
    filtered_unique_intersection AS (
        SELECT saving_account
        FROM unique_intersection
        WHERE Product_Type IN ('Women Informal', 'Women Formal')
        AND disbursed_date >= '2024-10-01'
        AND saving_account NOT IN (
            SELECT saving_account
            FROM unique_intersection
            WHERE Product_Type IN ('Women Informal', 'Women Formal')
            AND disbursed_date < '2024-10-01'
        )
    )
    SELECT COUNT(DISTINCT kiyya_customer.kiyya_id) as totalCount
    FROM kiyya_customer
    LEFT JOIN filtered_conversiondata 
        ON kiyya_customer.account_number = filtered_conversiondata.saving_account
    LEFT JOIN filtered_unique_intersection 
        ON kiyya_customer.account_number = filtered_unique_intersection.saving_account
    LEFT JOIN user_infos
        ON kiyya_customer.userId = user_infos.userId
    LEFT JOIN crm_user
        ON kiyya_customer.userId = crm_user.crm_id 
    LEFT JOIN crm_list
        ON crm_user.employe_id = crm_list.employe_id
    WHERE kiyya_customer.userId != '1cc2ceef-fc07-44b9-9696-86d734d1dd59'
    AND kiyya_customer.registered_date >= '2024-10-01'

    
        -- Role-based filtering
    AND (
        :user_role = 'Admin'  -- Admin can access all records
        OR 
        (   -- Branch user can only access records within their branch
            :user_role = 'Branch User'
            AND kiyya_customer.userId = :userId
        )
    )
    AND (
        COALESCE(user_infos.full_name, crm_list.full_name) IN (:catagory)  -- Dynamic category filter (supports a list)
        OR
        COALESCE(user_infos.district, crm_list.sub_process) IN (:catagory)  -- Dynamic category filter (supports a list)
    )
    AND NOT EXISTS (
        SELECT 1
        FROM kiyya_customer AS kc
        WHERE kc.account_number = kiyya_customer.account_number
        AND kc.registered_date < '2024-10-01'
    )
    AND NOT EXISTS (
        SELECT 1
        FROM kiyya_customer AS kc
        WHERE kc.phone_number = kiyya_customer.phone_number
        AND kc.registered_date < '2024-10-01'
    )
    AND (
        filtered_conversiondata.saving_account IS NOT NULL 
        OR filtered_unique_intersection.saving_account IS NOT NULL
    )        
`


const tolalInformalCustomer_withOutLoan=`
        WITH filtered_conversiondata AS (
            -- Filter conversiondata for October based on Product_Type and disbursed_date >= '2024-10-01'
            SELECT saving_account
            FROM conversiondata
            WHERE Product_Type IN ('Women Informal', 'Women Formal')
            -- AND disbursed_date >= '2024-10-01'
        ),
        filtered_unique_intersection AS (
            -- Filter unique_intersection for October based on Product_Type and disbursed_date >= '2024-10-01'
            SELECT saving_account
            FROM unique_intersection
            WHERE Product_Type IN ('Women Informal', 'Women Formal')
        )
        SELECT COUNT(DISTINCT kiyya_customer.kiyya_id) as totalCount
        FROM kiyya_customer
        LEFT JOIN user_infos
            ON kiyya_customer.userId = user_infos.userId
        LEFT JOIN crm_user
            ON kiyya_customer.userId = crm_user.crm_id 
        LEFT JOIN crm_list
            ON crm_user.employe_id = crm_list.employe_id
        WHERE kiyya_customer.registered_date >= '2024-10-01'
        AND kiyya_customer.userId != '1cc2ceef-fc07-44b9-9696-86d734d1dd59'
        
            -- Role-based filtering
        AND (
            :user_role = 'Admin'  -- Admin can access all records
            OR 
            (   -- Branch user can only access records within their branch
                :user_role = 'Branch User'
                AND kiyya_customer.userId = :userId
            )
        )
        -- Check that the customer is not found in conversiondata by account_number or phone_number
        AND NOT EXISTS (
            SELECT 1
            FROM filtered_conversiondata fcd
            WHERE fcd.saving_account = kiyya_customer.account_number
            -- OR fcd.phone_number = kiyya_customer.phone_number
        )
        -- Check that the customer is not found in unique_intersection by account_number or phone_number
        AND NOT EXISTS (
            SELECT 1
            FROM filtered_unique_intersection fui
            WHERE fui.saving_account = kiyya_customer.account_number
            -- OR fui.phone_number = kiyya_customer.phone_number
        );
`


const tolalInformalCustomer_withOutLoanFiltering=`
        WITH filtered_conversiondata AS (
            -- Filter conversiondata for October based on Product_Type and disbursed_date >= '2024-10-01'
            SELECT saving_account
            FROM conversiondata
            WHERE Product_Type IN ('Women Informal', 'Women Formal')
            -- AND disbursed_date >= '2024-10-01'
        ),
        filtered_unique_intersection AS (
            -- Filter unique_intersection for October based on Product_Type and disbursed_date >= '2024-10-01'
            SELECT saving_account
            FROM unique_intersection
            WHERE Product_Type IN ('Women Informal', 'Women Formal')
        )
        SELECT COUNT(DISTINCT kiyya_customer.kiyya_id) as totalCount
        FROM kiyya_customer
        LEFT JOIN user_infos
            ON kiyya_customer.userId = user_infos.userId
        LEFT JOIN crm_user
            ON kiyya_customer.userId = crm_user.crm_id 
        LEFT JOIN crm_list
            ON crm_user.employe_id = crm_list.employe_id
        WHERE kiyya_customer.registered_date >= '2024-10-01'
        AND kiyya_customer.userId != '1cc2ceef-fc07-44b9-9696-86d734d1dd59'

        
        -- Role-based filtering
        AND (
            :user_role = 'Admin'  -- Admin can access all records
            OR 
            (   -- Branch user can only access records within their branch
                :user_role = 'Branch User'
                AND kiyya_customer.userId = :userId
            )
        )
        AND (
            COALESCE(user_infos.full_name, crm_list.full_name) IN (:catagory)  -- Dynamic category filter (supports a list)
            OR
            COALESCE(user_infos.district, crm_list.sub_process) IN (:catagory)  -- Dynamic category filter (supports a list)
        )
        -- Check that the customer is not found in conversiondata by account_number or phone_number
        AND NOT EXISTS (
            SELECT 1
            FROM filtered_conversiondata fcd
            WHERE fcd.saving_account = kiyya_customer.account_number
            -- OR fcd.phone_number = kiyya_customer.phone_number
        )
        -- Check that the customer is not found in unique_intersection by account_number or phone_number
        AND NOT EXISTS (
            SELECT 1
            FROM filtered_unique_intersection fui
            WHERE fui.saving_account = kiyya_customer.account_number
            -- OR fui.phone_number = kiyya_customer.phone_number
        );
`


const loanRecivedQueryPeruserForFormalKiyyaCustomer=`
    WITH filtered_conversiondata AS (
        SELECT saving_account, branch_code 
        FROM conversiondata
        WHERE Product_Type IN ('Women Informal', 'Women Formal')
        AND disbursed_date >= '2024-10-01'
        AND saving_account NOT IN (
            SELECT saving_account
            FROM conversiondata
            WHERE Product_Type IN ('Women Informal', 'Women Formal')
            AND disbursed_date < '2024-10-01'
        )
    ),
    filtered_unique_intersection AS (
        SELECT saving_account, branch_code 
        FROM unique_intersection
        WHERE Product_Type IN ('Women Informal', 'Women Formal')
        AND disbursed_date >= '2024-10-01'
        AND saving_account NOT IN (
            SELECT saving_account
            FROM unique_intersection
            WHERE Product_Type IN ('Women Informal', 'Women Formal')
            AND disbursed_date < '2024-10-01'
        )
    )
    SELECT DISTINCT 
        women_product_customer.wpc_id, 
        women_product_customer.account_no, 
        women_product_customer.phone_number, 
        women_product_customer.full_name,
        women_product_customer.disbursed_amount,
        COALESCE(user_infos.full_name, crm_list.full_name) AS recruiter_name,  
        COALESCE(user_infos.district, crm_list.sub_process) As catagory,
        COALESCE(user_infos.district, crm_list.department) as supervice,
        COALESCE(filtered_conversiondata.branch_code, filtered_unique_intersection.branch_code) AS branch_code , -- Return branch_code;
        branch_list.branch_name,
        district_list.district_name,
        women_product_customer.registered_date
    FROM women_product_customer
    LEFT JOIN filtered_conversiondata 
        ON women_product_customer.account_no = filtered_conversiondata.saving_account
    LEFT JOIN filtered_unique_intersection 
        ON women_product_customer.account_no = filtered_unique_intersection.saving_account
    LEFT JOIN user_infos 
        ON women_product_customer.crm_id = user_infos.userId  
    LEFT JOIN crm_user
        ON women_product_customer.crm_id = crm_user.crm_id 
    LEFT JOIN crm_list
        ON crm_user.employe_id = crm_list.employe_id 

    LEFT JOIN branch_list 
        ON COALESCE(filtered_conversiondata.branch_code, filtered_unique_intersection.branch_code) = branch_list.branch_code
    LEFT JOIN district_list 
        ON branch_list.dis_Id = district_list.dis_Id

    WHERE women_product_customer.crm_id != '1cc2ceef-fc07-44b9-9696-86d734d1dd59'
    AND women_product_customer.registered_date >= '2024-10-01'
    
        -- Role-based filtering
    AND (
        :user_role = 'Admin'  -- Admin can access all records
        OR 
        (   -- Branch user can only access records within their branch
            :user_role = 'Branch User'
            AND women_product_customer.crm_id = :userId
        )
    )

    -- Dynamic filters based on input
    -- Search by account_no if provided
    AND (
        :account_no IS NULL OR women_product_customer.account_no = :account_no
    )

    -- Search by phone_number if provided
    AND (
        :phone_number IS NULL OR women_product_customer.phone_number = :phone_number
    )

    -- AND COALESCE(user_infos.district, crm_list.sub_process) = :catagory  -- Filter by dynamic category
    AND NOT EXISTS (
        SELECT 1
        FROM women_product_customer AS wc
        WHERE wc.account_no = women_product_customer.account_no
        AND wc.registered_date < '2024-10-01'
    )
    AND NOT EXISTS (
        SELECT 1
        FROM women_product_customer AS wc
        WHERE wc.phone_number = women_product_customer.phone_number
        AND wc.registered_date < '2024-10-01'
    )
    AND (
        filtered_conversiondata.saving_account IS NOT NULL 
        OR filtered_unique_intersection.saving_account IS NOT NULL
    )
    LIMIT :limit OFFSET :offset;
`



const loanRecivedQueryPeruserForFormalKiyyaCustomerFiltering=`
    WITH filtered_conversiondata AS (
        SELECT saving_account, branch_code 
        FROM conversiondata
        WHERE Product_Type IN ('Women Informal', 'Women Formal')
        AND disbursed_date >= '2024-10-01'
        AND saving_account NOT IN (
            SELECT saving_account
            FROM conversiondata
            WHERE Product_Type IN ('Women Informal', 'Women Formal')
            AND disbursed_date < '2024-10-01'
        )
    ),
    filtered_unique_intersection AS (
        SELECT saving_account, branch_code 
        FROM unique_intersection
        WHERE Product_Type IN ('Women Informal', 'Women Formal')
        AND disbursed_date >= '2024-10-01'
        AND saving_account NOT IN (
            SELECT saving_account
            FROM unique_intersection
            WHERE Product_Type IN ('Women Informal', 'Women Formal')
            AND disbursed_date < '2024-10-01'
        )
    )
    SELECT DISTINCT 
        women_product_customer.wpc_id, 
        women_product_customer.account_no, 
        women_product_customer.phone_number, 
        women_product_customer.full_name,
        women_product_customer.disbursed_amount,
        COALESCE(user_infos.full_name, crm_list.full_name) AS recruiter_name,  
        COALESCE(user_infos.district, crm_list.sub_process) As catagory,
        COALESCE(user_infos.district, crm_list.department) as supervice,
        COALESCE(filtered_conversiondata.branch_code, filtered_unique_intersection.branch_code) AS branch_code , -- Return branch_code;
        branch_list.branch_name,
        district_list.district_name,
        women_product_customer.registered_date
    FROM women_product_customer
    LEFT JOIN filtered_conversiondata 
        ON women_product_customer.account_no = filtered_conversiondata.saving_account
    LEFT JOIN filtered_unique_intersection 
        ON women_product_customer.account_no = filtered_unique_intersection.saving_account
    LEFT JOIN user_infos 
        ON women_product_customer.crm_id = user_infos.userId  
    LEFT JOIN crm_user
        ON women_product_customer.crm_id = crm_user.crm_id 
    LEFT JOIN crm_list
        ON crm_user.employe_id = crm_list.employe_id 

    LEFT JOIN branch_list 
        ON COALESCE(filtered_conversiondata.branch_code, filtered_unique_intersection.branch_code) = branch_list.branch_code
    LEFT JOIN district_list 
        ON branch_list.dis_Id = district_list.dis_Id

    WHERE women_product_customer.crm_id != '1cc2ceef-fc07-44b9-9696-86d734d1dd59'
    AND women_product_customer.registered_date >= '2024-10-01'

        -- Role-based filtering
    AND (
        :user_role = 'Admin'  -- Admin can access all records
        OR 
        (   -- Branch user can only access records within their branch
            :user_role = 'Branch User'
            AND women_product_customer.crm_id = :userId
        )
    )

    -- Dynamic filters based on input
    -- Search by account_no if provided
    AND (
        :account_no IS NULL OR women_product_customer.account_no = :account_no
    )

    -- Search by phone_number if provided
    AND (
        :phone_number IS NULL OR women_product_customer.phone_number = :phone_number
    )

    -- AND COALESCE(user_infos.district, crm_list.sub_process) = :catagory  -- Filter by dynamic category
    AND (
        COALESCE(user_infos.full_name, crm_list.full_name) IN (:catagory)  -- Dynamic category filter (supports a list)
        OR
        COALESCE(user_infos.district, crm_list.sub_process) IN (:catagory)  -- Dynamic category filter (supports a list)
    )
    AND NOT EXISTS (
        SELECT 1
        FROM women_product_customer AS wc
        WHERE wc.account_no = women_product_customer.account_no
        AND wc.registered_date < '2024-10-01'
    )
    AND NOT EXISTS (
        SELECT 1
        FROM women_product_customer AS wc
        WHERE wc.phone_number = women_product_customer.phone_number
        AND wc.registered_date < '2024-10-01'
    )
    AND (
        filtered_conversiondata.saving_account IS NOT NULL 
        OR filtered_unique_intersection.saving_account IS NOT NULL
    )
    LIMIT :limit OFFSET :offset;
`


const totalFormalKiyyaCustomerLoanRecived=`
  WITH filtered_conversiondata AS (
        SELECT saving_account, branch_code 
        FROM conversiondata
        WHERE Product_Type IN ('Women Informal', 'Women Formal')
        AND disbursed_date >= '2024-10-01'
        AND saving_account NOT IN (
            SELECT saving_account
            FROM conversiondata
            WHERE Product_Type IN ('Women Informal', 'Women Formal')
            AND disbursed_date < '2024-10-01'
        )
    ),
    filtered_unique_intersection AS (
        SELECT saving_account, branch_code 
        FROM unique_intersection
        WHERE Product_Type IN ('Women Informal', 'Women Formal')
        AND disbursed_date >= '2024-10-01'
        AND saving_account NOT IN (
            SELECT saving_account
            FROM unique_intersection
            WHERE Product_Type IN ('Women Informal', 'Women Formal')
            AND disbursed_date < '2024-10-01'
        )
    )
    SELECT COUNT(DISTINCT women_product_customer.wpc_id) as totalCount
    FROM women_product_customer
    LEFT JOIN filtered_conversiondata 
        ON women_product_customer.account_no = filtered_conversiondata.saving_account
    LEFT JOIN filtered_unique_intersection 
        ON women_product_customer.account_no = filtered_unique_intersection.saving_account
    LEFT JOIN user_infos 
        ON women_product_customer.crm_id = user_infos.userId  
    LEFT JOIN crm_user
        ON women_product_customer.crm_id = crm_user.crm_id 
    LEFT JOIN crm_list
        ON crm_user.employe_id = crm_list.employe_id 

    LEFT JOIN branch_list 
        ON COALESCE(filtered_conversiondata.branch_code, filtered_unique_intersection.branch_code) = branch_list.branch_code
    LEFT JOIN district_list 
        ON branch_list.dis_Id = district_list.dis_Id

    WHERE women_product_customer.crm_id != '1cc2ceef-fc07-44b9-9696-86d734d1dd59'
    AND women_product_customer.registered_date >= '2024-10-01'

    
        -- Role-based filtering
    AND (
        :user_role = 'Admin'  -- Admin can access all records
        OR 
        (   -- Branch user can only access records within their branch
            :user_role = 'Branch User'
            AND women_product_customer.crm_id = :userId
        )
    )
    -- AND COALESCE(user_infos.district, crm_list.sub_process) = :catagory  -- Filter by dynamic category
    AND NOT EXISTS (
        SELECT 1
        FROM women_product_customer AS wc
        WHERE wc.account_no = women_product_customer.account_no
        AND wc.registered_date < '2024-10-01'
    )
    AND NOT EXISTS (
        SELECT 1
        FROM women_product_customer AS wc
        WHERE wc.phone_number = women_product_customer.phone_number
        AND wc.registered_date < '2024-10-01'
    )
    AND (
        filtered_conversiondata.saving_account IS NOT NULL 
        OR filtered_unique_intersection.saving_account IS NOT NULL
    )
`

const totalFormalKiyyaCustomerLoanRecivedFiltering=`
  WITH filtered_conversiondata AS (
        SELECT saving_account, branch_code 
        FROM conversiondata
        WHERE Product_Type IN ('Women Informal', 'Women Formal')
        AND disbursed_date >= '2024-10-01'
        AND saving_account NOT IN (
            SELECT saving_account
            FROM conversiondata
            WHERE Product_Type IN ('Women Informal', 'Women Formal')
            AND disbursed_date < '2024-10-01'
        )
    ),
    filtered_unique_intersection AS (
        SELECT saving_account, branch_code 
        FROM unique_intersection
        WHERE Product_Type IN ('Women Informal', 'Women Formal')
        AND disbursed_date >= '2024-10-01'
        AND saving_account NOT IN (
            SELECT saving_account
            FROM unique_intersection
            WHERE Product_Type IN ('Women Informal', 'Women Formal')
            AND disbursed_date < '2024-10-01'
        )
    )
    SELECT COUNT(DISTINCT women_product_customer.wpc_id) as totalCount
    FROM women_product_customer
    LEFT JOIN filtered_conversiondata 
        ON women_product_customer.account_no = filtered_conversiondata.saving_account
    LEFT JOIN filtered_unique_intersection 
        ON women_product_customer.account_no = filtered_unique_intersection.saving_account
    LEFT JOIN user_infos 
        ON women_product_customer.crm_id = user_infos.userId  
    LEFT JOIN crm_user
        ON women_product_customer.crm_id = crm_user.crm_id 
    LEFT JOIN crm_list
        ON crm_user.employe_id = crm_list.employe_id 

    LEFT JOIN branch_list 
        ON COALESCE(filtered_conversiondata.branch_code, filtered_unique_intersection.branch_code) = branch_list.branch_code
    LEFT JOIN district_list 
        ON branch_list.dis_Id = district_list.dis_Id

    WHERE women_product_customer.crm_id != '1cc2ceef-fc07-44b9-9696-86d734d1dd59'
    AND women_product_customer.registered_date >= '2024-10-01'

    
    -- Role-based filtering
    AND (
        :user_role = 'Admin'  -- Admin can access all records
        OR 
        (   -- Branch user can only access records within their branch
            :user_role = 'Branch User'
            AND women_product_customer.crm_id = :userId
        )
    )

    -- AND COALESCE(user_infos.district, crm_list.sub_process) = :catagory  -- Filter by dynamic category
    AND (
        COALESCE(user_infos.full_name, crm_list.full_name) IN (:catagory)  -- Dynamic category filter (supports a list)
        OR
        COALESCE(user_infos.district, crm_list.sub_process) IN (:catagory)  -- Dynamic category filter (supports a list)
    )
    AND NOT EXISTS (
        SELECT 1
        FROM women_product_customer AS wc
        WHERE wc.account_no = women_product_customer.account_no
        AND wc.registered_date < '2024-10-01'
    )
    AND NOT EXISTS (
        SELECT 1
        FROM women_product_customer AS wc
        WHERE wc.phone_number = women_product_customer.phone_number
        AND wc.registered_date < '2024-10-01'
    )
    AND (
        filtered_conversiondata.saving_account IS NOT NULL 
        OR filtered_unique_intersection.saving_account IS NOT NULL
    )
`


const noneLoanAccessedFormalKiyyaCustomer=`
        WITH filtered_conversiondata AS (
            -- Filter conversiondata for October based on Product_Type and disbursed_date >= '2024-10-01'
            SELECT saving_account
            FROM conversiondata
            WHERE Product_Type IN ('Women Informal', 'Women Formal')
            -- AND disbursed_date >= '2024-10-01'
        ),
        filtered_unique_intersection AS (
            -- Filter unique_intersection for October based on Product_Type and disbursed_date >= '2024-10-01'
            SELECT saving_account
            FROM unique_intersection
            WHERE Product_Type IN ('Women Informal', 'Women Formal')
        )
        SELECT DISTINCT 
            women_product_customer.wpc_id, 
            women_product_customer.full_name,
            women_product_customer.account_no, 
            women_product_customer.disbursed_amount,
            women_product_customer.phone_number, 
            COALESCE(user_infos.full_name, crm_list.full_name) AS recruiter_name,  
            COALESCE(user_infos.district, crm_list.sub_process) As catagory,
            COALESCE(user_infos.district, crm_list.department) as supervice,
            women_product_customer.registered_date
        FROM women_product_customer
        LEFT JOIN user_infos 
            ON women_product_customer.crm_id = user_infos.userId  
        LEFT JOIN crm_user
            ON women_product_customer.crm_id = crm_user.crm_id 
        LEFT JOIN crm_list
        ON crm_user.employe_id = crm_list.employe_id 
        WHERE women_product_customer.registered_date >= '2024-10-01'
        AND women_product_customer.crm_id != '1cc2ceef-fc07-44b9-9696-86d734d1dd59'
        AND COALESCE(user_infos.district, crm_list.sub_process) = :catagory  -- Filter by dynamic category

            
        -- Role-based filtering
        AND (
            :user_role = 'Admin'  -- Admin can access all records
            OR 
            (   -- Branch user can only access records within their branch
                :user_role = 'Branch User'
                AND women_product_customer.crm_id = :userId
            )
        )

        -- Dynamic filters based on input
        -- Search by account_no if provided
        AND (
            :account_no IS NULL OR women_product_customer.account_no = :account_no
        )

        -- Search by phone_number if provided
        AND (
            :phone_number IS NULL OR women_product_customer.phone_number = :phone_number
        )

        
        -- Check that the customer is not found in conversiondata by account_number or phone_number
        AND NOT EXISTS (
            SELECT 1
            FROM filtered_conversiondata fcd
            WHERE fcd.saving_account = women_product_customer.account_no
            -- OR fcd.phone_number = kc.phone_number
        )
        -- Check that the customer is not found in unique_intersection by account_number or phone_number
        AND NOT EXISTS (
            SELECT 1
            FROM filtered_unique_intersection fui
            WHERE fui.saving_account = women_product_customer.account_no
            -- OR fui.phone_number = kc.phone_number
        )

        LIMIT :limit OFFSET :offset;
`


const noneLoanAccessedFormalKiyyaCustomerFiltering=`
        WITH filtered_conversiondata AS (
            -- Filter conversiondata for October based on Product_Type and disbursed_date >= '2024-10-01'
            SELECT saving_account
            FROM conversiondata
            WHERE Product_Type IN ('Women Informal', 'Women Formal')
            -- AND disbursed_date >= '2024-10-01'
        ),
        filtered_unique_intersection AS (
            -- Filter unique_intersection for October based on Product_Type and disbursed_date >= '2024-10-01'
            SELECT saving_account
            FROM unique_intersection
            WHERE Product_Type IN ('Women Informal', 'Women Formal')
        )
        SELECT DISTINCT 
            women_product_customer.wpc_id, 
            women_product_customer.full_name,
            women_product_customer.account_no, 
            women_product_customer.disbursed_amount,
            women_product_customer.phone_number, 
            COALESCE(user_infos.full_name, crm_list.full_name) AS recruiter_name,  
            COALESCE(user_infos.district, crm_list.sub_process) As catagory,
            COALESCE(user_infos.district, crm_list.department) as supervice,
            women_product_customer.registered_date
        FROM women_product_customer
        LEFT JOIN user_infos 
            ON women_product_customer.crm_id = user_infos.userId  
        LEFT JOIN crm_user
            ON women_product_customer.crm_id = crm_user.crm_id 
        LEFT JOIN crm_list
        ON crm_user.employe_id = crm_list.employe_id 
        WHERE women_product_customer.registered_date >= '2024-10-01'
        AND women_product_customer.crm_id != '1cc2ceef-fc07-44b9-9696-86d734d1dd59'

        
        -- Role-based filtering
        AND (
            :user_role = 'Admin'  -- Admin can access all records
            OR 
            (   -- Branch user can only access records within their branch
                :user_role = 'Branch User'
                AND women_product_customer.crm_id = :userId
            )
        )

        -- Dynamic filters based on input
        -- Search by account_no if provided
        AND (
            :account_no IS NULL OR women_product_customer.account_no = :account_no
        )

        -- Search by phone_number if provided
        AND (
            :phone_number IS NULL OR women_product_customer.phone_number = :phone_number
        )
    
        AND (
            COALESCE(user_infos.full_name, crm_list.full_name) IN (:catagory)  -- Dynamic category filter (supports a list)
            OR
            COALESCE(user_infos.district, crm_list.sub_process) IN (:catagory)  -- Dynamic category filter (supports a list)
        )
        -- Check that the customer is not found in conversiondata by account_number or phone_number
        AND NOT EXISTS (
            SELECT 1
            FROM filtered_conversiondata fcd
            WHERE fcd.saving_account = women_product_customer.account_no
            -- OR fcd.phone_number = kc.phone_number
        )
        -- Check that the customer is not found in unique_intersection by account_number or phone_number
        AND NOT EXISTS (
            SELECT 1
            FROM filtered_unique_intersection fui
            WHERE fui.saving_account = women_product_customer.account_no
            -- OR fui.phone_number = kc.phone_number
        )

        LIMIT :limit OFFSET :offset;
`


const totalkiyyaFromalCustomer_withoutLoan=`
        WITH filtered_conversiondata AS (
            -- Filter conversiondata for October based on Product_Type and disbursed_date >= '2024-10-01'
            SELECT saving_account
            FROM conversiondata
            WHERE Product_Type IN ('Women Informal', 'Women Formal')
            -- AND disbursed_date >= '2024-10-01'
        ),
        filtered_unique_intersection AS (
            -- Filter unique_intersection for October based on Product_Type and disbursed_date >= '2024-10-01'
            SELECT saving_account
            FROM unique_intersection
            WHERE Product_Type IN ('Women Informal', 'Women Formal')
        )
        SELECT COUNT(DISTINCT women_product_customer.wpc_id) as totalCount
        FROM women_product_customer
        LEFT JOIN user_infos 
            ON women_product_customer.crm_id = user_infos.userId  
        LEFT JOIN crm_user
            ON women_product_customer.crm_id = crm_user.crm_id 
        LEFT JOIN crm_list
        ON crm_user.employe_id = crm_list.employe_id 
        WHERE women_product_customer.registered_date >= '2024-10-01'
        AND women_product_customer.crm_id != '1cc2ceef-fc07-44b9-9696-86d734d1dd59'

        
            -- Role-based filtering
        AND (
            :user_role = 'Admin'  -- Admin can access all records
            OR 
            (   -- Branch user can only access records within their branch
                :user_role = 'Branch User'
                AND women_product_customer.crm_id = :userId
            )
        )

        -- Check that the customer is not found in conversiondata by account_number or phone_number
        AND NOT EXISTS (
            SELECT 1
            FROM filtered_conversiondata fcd
            WHERE fcd.saving_account = women_product_customer.account_no
            -- OR fcd.phone_number = kc.phone_number
        )
        -- Check that the customer is not found in unique_intersection by account_number or phone_number
        AND NOT EXISTS (
            SELECT 1
            FROM filtered_unique_intersection fui
            WHERE fui.saving_account = women_product_customer.account_no
            -- OR fui.phone_number = kc.phone_number
        );
`

const totalkiyyaFromalCustomer_withoutLoanFiltering=`
        WITH filtered_conversiondata AS (
            -- Filter conversiondata for October based on Product_Type and disbursed_date >= '2024-10-01'
            SELECT saving_account
            FROM conversiondata
            WHERE Product_Type IN ('Women Informal', 'Women Formal')
            -- AND disbursed_date >= '2024-10-01'
        ),
        filtered_unique_intersection AS (
            -- Filter unique_intersection for October based on Product_Type and disbursed_date >= '2024-10-01'
            SELECT saving_account
            FROM unique_intersection
            WHERE Product_Type IN ('Women Informal', 'Women Formal')
        )
        SELECT COUNT(DISTINCT women_product_customer.wpc_id) as totalCount
        FROM women_product_customer
        LEFT JOIN user_infos 
            ON women_product_customer.crm_id = user_infos.userId  
        LEFT JOIN crm_user
            ON women_product_customer.crm_id = crm_user.crm_id 
        LEFT JOIN crm_list
        ON crm_user.employe_id = crm_list.employe_id 
        WHERE women_product_customer.registered_date >= '2024-10-01'
        AND women_product_customer.crm_id != '1cc2ceef-fc07-44b9-9696-86d734d1dd59'

        
            -- Role-based filtering
        AND (
            :user_role = 'Admin'  -- Admin can access all records
            OR 
            (   -- Branch user can only access records within their branch
                :user_role = 'Branch User'
                AND women_product_customer.crm_id = :userId
            )
        )
    
        AND (
            COALESCE(user_infos.full_name, crm_list.full_name) IN (:catagory)  -- Dynamic category filter (supports a list)
            OR
            COALESCE(user_infos.district, crm_list.sub_process) IN (:catagory)  -- Dynamic category filter (supports a list)
        )
        -- Check that the customer is not found in conversiondata by account_number or phone_number
        AND NOT EXISTS (
            SELECT 1
            FROM filtered_conversiondata fcd
            WHERE fcd.saving_account = women_product_customer.account_no
            -- OR fcd.phone_number = kc.phone_number
        )
        -- Check that the customer is not found in unique_intersection by account_number or phone_number
        AND NOT EXISTS (
            SELECT 1
            FROM filtered_unique_intersection fui
            WHERE fui.saving_account = women_product_customer.account_no
            -- OR fui.phone_number = kc.phone_number
        );
`


module.exports={loanRecivedQueryPeruser,totalLoanRecivedCountQuerys,
    loanRecivedQueryPeruserFiltering,totalLoanRecivedCountQuerysFiltering,
    None_loan_accessedCustomer,tolalInformalCustomer_withOutLoan,
    None_loan_accessedCustomerFiltering,tolalInformalCustomer_withOutLoanFiltering,
    loanRecivedQueryPeruserForFormalKiyyaCustomer,totalFormalKiyyaCustomerLoanRecived,
    loanRecivedQueryPeruserForFormalKiyyaCustomerFiltering,totalFormalKiyyaCustomerLoanRecivedFiltering,
    noneLoanAccessedFormalKiyyaCustomer,totalkiyyaFromalCustomer_withoutLoan,
    noneLoanAccessedFormalKiyyaCustomerFiltering,totalkiyyaFromalCustomer_withoutLoanFiltering
}