CREATE TABLE beers_join_therapeutic_category AS
SELECT ucl2.ID, ucl2.DrugExamples, beers_therapeutic_category_guidance.EntryID, beers_therapeutic_category_guidance.TherapeuticCategory FROM usp_class_lookup ucl2 
RIGHT JOIN beers_therapeutic_category_guidance  
ON ucl2.Category like CONCAT('%', beers_therapeutic_category_guidance.TherapeuticCategory, '%')  ; 