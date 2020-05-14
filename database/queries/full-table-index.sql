CREATE TABLE dropdown_index AS
SELECT
	EntryID,
	DrugExamples
from
	beers_join_drug_classes bjdc
where
	lower(bjdc.DrugExamples) NOT LIKE "%and%"
	AND lower(bjdc.DrugExamples) NOT LIKE "%/%"
	AND lower(bjdc.DrugExamples)  NOT LIKE "%apap%"
	AND lower(bjdc.DrugExamples)  NOT LIKE "%acetaminophen%"
	AND lower(bjdc.DrugExamples)  not like "%caffeine%"
UNION
SELECT
	EntryID,
	DrugExamples
from
	beers_join_therapeutic_category bjtc
where
	lower(bjtc.DrugExamples)  NOT LIKE "%and%"
	AND lower(bjtc.DrugExamples)  NOT LIKE "%/%"
	AND lower(bjtc.DrugExamples)  NOT LIKE "%apap%"
	AND lower(bjtc.DrugExamples)  NOT LIKE "%acetaminophen%"
	AND lower(bjtc.DrugExamples)  not like "%caffeine%"
UNION
SELECT
	EntryID,
	Trade_Name
from
	beers_join_brand_generic bjbg
where
	lower(bjbg.Trade_Name)  NOT LIKE "%and%"
	AND lower(bjbg.Trade_Name)  NOT LIKE "%/%"
	AND lower(bjbg.Trade_Name)  NOT LIKE "%apap%"
	AND lower(bjbg.Trade_Name)  NOT LIKE "%acetaminophen%"
	AND lower(bjbg.Trade_Name)  NOT LIKE "%caffeine%";


CREATE TABLE dropdown_items AS
SELECT
	DISTINCT DrugExamples
FROM
	dropdown_index di;