CREATE TABLE dropdown_index_d 
SELECT
	*
FROM
	dropdown_index di
WHERE
	LOWER(di.DrugExamples) not like LOWER("% with %") AND
	LOWER(di.DrugExamples) not like LOWER("%,%") AND 
	LOWER(di.DrugExamples) not like LOWER("%/%") AND
	LOWER(di.DrugExamples) not like LOWER("% and %")