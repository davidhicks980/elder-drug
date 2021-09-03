![elder-drug-text](https://user-images.githubusercontent.com/59215665/131998947-b11a931e-dd51-4610-8daf-65de54e0423c.png)


Elderdrug.com was created to make it easier to search for drugs that should be taken with caution in patients over 65. It is composed of 1600 drugs that map to guidance from [AGS](https://geriatricscareonline.org/ProductAbstract/american-geriatrics-society-updated-beers-criteria-for-potentially-inappropriate-medication-use-in-older-adults/CL001). Many drugs in this database have been determined by querying Class/Therapeutic Category members (e.g. Cyclooxygenase Inhibitors) from RxNorm, and using the resulting generic RxCUIs to query brand names. 

While I hope this is a useful tool, the drugs in this database were determined programmatically via RxNorm, so I cannot guarantee every entry will be accurate. For example, Loperamide will show up as an opioid to avoid in those over the age of 65, because it is an opioid. However, loperamide has extremely weak opioid activity, and is, as a result, relatively safe for those 65+. As such, if you choose to use Elder Drug, do so with the understanding that it should not be used to diagnose, treat, cure, or prevent any disease.
