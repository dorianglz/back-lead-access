-- UPDATE departement

SET SQL_SAFE_UPDATES = 0;

UPDATE lead_access_app.leads SET departement = substring(zipcode, 1, 2);
select * from lead_access_app.leads;

SET SQL_SAFE_UPDATES = 1;



--- set manager 1

SET SQL_SAFE_UPDATES = 0;

UPDATE lead_access_app.leads set manager_id = 1 where manager_id IS NULL;

SET SQL_SAFE_UPDATES = 1;




--- clean CSV
--- perl -i.bak -pe 's/[^[:ascii:]]//g' NewBDD.csv