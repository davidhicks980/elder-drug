CREATE TABLE all_guidance as
SELECT * FROM beers_class_guidance bcg 
UNION
SELECT * FROM beers_drug_guidance bdg 
UNION 
SELECT * FROM beers_therapeutic_category_guidance btcg 