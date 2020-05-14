CREATE TABLE beers_join_therapeutic_category AS
SELECT ucl2.ID, ucl2.DrugExamples, beers_therapeutic_category_guidance.EntryID, beers_therapeutic_category_guidance.TherapeuticCategory FROM usp_class_lookup ucl2 
RIGHT JOIN beers_therapeutic_category_guidance  
ON ucl2.Category like CONCAT('%', beers_therapeutic_category_guidance.TherapeuticCategory, '%')  
UNION 
SELECT ni.ID, ni.NONPROPRIETARYNAME , beers_therapeutic_category_guidance.EntryID, beers_therapeutic_category_guidance.TherapeuticCategory FROM ndc_info ni 
RIGHT JOIN beers_therapeutic_category_guidance  
ON ni.PHARM_CLASSES like CONCAT('%', beers_therapeutic_category_guidance.TherapeuticCategory, '%')  
; 

CREATE TABLE beers_join_drug_classes AS
SELECT ucl2.ID, ucl2.DrugExamples, beers_class_guidance.EntryID, beers_class_guidance.Class FROM usp_class_lookup ucl2 
RIGHT JOIN beers_class_guidance  
ON ucl2.Class like CONCAT('%', beers_class_guidance.Class, '%')  
UNION 
SELECT ni.ID, ni.NONPROPRIETARYNAME , beers_class_guidance.EntryID, beers_class_guidance.Class FROM ndc_info ni 
RIGHT JOIN beers_class_guidance  
ON ni.PHARM_CLASSES like CONCAT('%', beers_class_guidance.Class , '%')  
; 

CREATE TABLE beers_join_brand_generic AS
SELECT obgb.ID, obgb.Trade_Name, beers_drug_guidance.EntryID, beers_drug_guidance.Drug FROM orange_book_generic_brand obgb 
RIGHT JOIN beers_drug_guidance  
ON obgb.Ingredient like CONCAT('%', beers_drug_guidance.Drug, '%')  
; 