SELECT
	*
FROM
	dropdown_index di
LEFT JOIN all_guidance ON
	di.EntryID = all_guidance.EntryID
	WHERE di.DrugExamples like "%ibuprofen%"
