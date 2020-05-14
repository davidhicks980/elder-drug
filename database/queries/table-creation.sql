
-- Gets list of drugs that match up with therapeutic categories or classes
CREATE TABLE FullDropdownItems
SELECT DISTINCT lower(PHARM_CLASSES)
FROM FullProductInfo fpi 
RIGHT JOIN DrugInfo ON PHARM_CLASSES like CONCAT("%", Class , "%") OR  PHARM_CLASSES LIKE CONCAT("%", TherapeuticCategory , "%")
UNION
SELECT DISTINCT lower(NONPROPRIETARYNAME)
FROM FullProductInfo fpi 
RIGHT JOIN DrugInfo ON PHARM_CLASSES like CONCAT("%", Class , "%") OR  PHARM_CLASSES LIKE CONCAT("%", TherapeuticCategory , "%")
UNION
SELECT DISTINCT lower(PROPRIETARYNAME)
FROM FullProductInfo fpi 
RIGHT JOIN DrugInfo ON PHARM_CLASSES like CONCAT("%", Class , "%") OR  PHARM_CLASSES LIKE CONCAT("%", TherapeuticCategory , "%")

CREATE TABLE GuidanceUsingDrug AS
SELECT * FROM DrugInfo WHERE Drug IS NOT NULL
CREATE TABLE GuidanceUsingPharmClass AS
SELECT * FROM GuidanceUsingClass WHERE Class IS NOT NULL
CREATE TABLE GuidanceUsingTherapeuticCategory AS
SELECT * FROM GuidanceUsingClass WHERE Class IS NULL

UNION
SELECT DISTINCT UPPER(NONPROPRIETARYNAME)
FROM NDCSynonymList nl 
RIGHT JOIN DrugInfo ON UPPER(NONPROPRIETARYNAME) LIKE UPPER([%Drug%])


-- creates new tables 
CREATE TABLE ClassSynonymList AS
SELECT DISTINCT NONPROPRIETARYNAME, PHARM_CLASSES 
FROM FullProductInfo fpi 
