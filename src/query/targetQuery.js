const targetQuery=`
WITH district_branches AS (
    -- Get branch codes for District User, based on the district they belong to
    SELECT bl.branch_code
    FROM branch_list bl
    JOIN district_list dl ON bl.dis_Id = dl.dis_Id
    WHERE dl.district_name = :district  -- This will be replaced with the user's district
),
all_targets AS (
    -- Select all branch targets
    SELECT kt.target_amount, kt.user_id
    FROM kiyya_target kt
    -- WHERE kt.target_month = '2024-10'  -- Assuming the target is for October 2024
)
SELECT SUM(at.target_amount) AS total_target
FROM all_targets at
WHERE 
    -- Branch User: Only get target for their branch
    (:user_role = 'Branch User' AND at.user_id = :branch_code)

    -- District User: Get targets for all branches within their district
    OR (:user_role = 'District User' AND at.user_id IN (SELECT branch_code FROM district_branches))

    -- Admin: Get targets for all branches
    OR (:user_role = 'Admin');
`



const targetFilter=`
WITH district_branches AS (
    -- Get branch codes for District User, based on the district they belong to
    SELECT bl.branch_code
    FROM branch_list bl
    JOIN district_list dl ON bl.dis_Id = dl.dis_Id
    WHERE dl.district_name = :district  -- This will be replaced with the user's district
),
all_targets AS (
    -- Select all branch targets
    SELECT kt.target_amount, kt.user_id, kt.branch_code
    FROM kiyya_target kt
    -- WHERE kt.target_month = '2024-10'  -- Assuming the target is for October 2024
)
SELECT SUM(at.target_amount) AS total_target
FROM all_targets at
WHERE 
    -- Branch User: Only get target for their branch
    (:user_role = 'Branch User' AND at.branch_code = :branch_code)

    -- District User: Get targets for all branches in their district or a specific branch in their district
    OR (:user_role = 'District User' AND (
        (at.branch_code IN (SELECT branch_code FROM district_branches))  -- All branches in the district
        OR (at.branch_code = :branch_code)  -- Specific branch
    ))

    -- Admin: Get targets for all branches, or a specific branch, or a specific district
    OR (:user_role = 'Admin' AND (
        at.branch_code = :branch_code  -- Specific branch
        OR at.branch_code IN (SELECT branch_code FROM district_branches)  -- Specific district
        OR 1=1  -- All branches (if no branch or district filter is applied)
    ));
`
module.exports={
    targetQuery,targetFilter
}