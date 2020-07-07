Create table guidance_key_item
SELECT
	EntryID,
	Item
from
	all_guidance ag;
#gets proprietary name, nonproprietary name and matches to key from all_guidance

create table propriety_nonpropriety_concatenation as
 SELECT
	gki.*,
	ndc_info.PROPRIETARYNAME ,
	ndc_info.NONPROPRIETARYNAME
FROM
	guidance_key_item gki
RIGHT JOIN ndc_info ON
	lower(ndc_info.NONPROPRIETARYNAME) like lower(CONCAT('%', gki.Item, '%'));



select uccim.EntryID, uccim.DrugExamples, orange_book_generic_brand.Trade_Name from usp_class_category_item_match uccim RIGHT JOIN orange_book_generic_brand on lower(orange_book_generic_brand.Ingredient) like CONCAT('%',lower(uccim.DrugExamples),'%') ;

CREATE TABLE delete_after as
select distinct EntryID, Item from proprietary_nonproprietary_concatenation pnc where EntryID is not null
UNION
select distinct EntryID, PROPRIETARYNAME from proprietary_nonproprietary_concatenation pnc where EntryID is not null
UNION
select uccim.EntryID, uccim.DrugExamples from usp_class_category_item_match uccim RIGHT JOIN orange_book_generic_brand on lower(orange_book_generic_brand.Ingredient) like CONCAT(lower(uccim.DrugExamples),'%') 
UNION 
select uccim.EntryID, orange_book_generic_brand.Trade_Name from usp_class_category_item_match uccim RIGHT JOIN orange_book_generic_brand on lower(orange_book_generic_brand.Ingredient) like CONCAT(lower(uccim.DrugExamples),'%') 

create  table dropdown_index_a as 
select distinct * from delete_after where EntryID is not null and Item  not like 'acetaminophen'

create table dropdown_items as
select Item from dropdown_index_a dia 