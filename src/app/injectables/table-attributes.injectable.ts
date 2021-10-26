import { InjectionToken } from '@angular/core';

import { TableCategories } from '../enums/TableCategories.enum';
import { TableAttributes } from '../interfaces/TableAttributes';

export const tableList: TableAttributes[] = [
  {
    tableNumber: TableCategories.General,
    fullTitle: 'General Information for Each Table',
    shortName: 'All Results',
    identifier: 'Info',
    tableIcon: 'general-health',
    description: 'Information encompassing all categories of Beers Criteria',
  },
  {
    tableNumber: TableCategories.PotentiallyInappropriate,
    fullTitle: 'Potentially Inappropriate Medication Use in Older Adults ',
    shortName: 'Inappropriate Medications in Older Adults',
    identifier: 'Inappropriate',
  },
  {
    tableNumber: TableCategories.DiseaseGuidance,
    fullTitle:
      'Potentially Inappropriate Medication Use in Older Adults Due to Drug-Disease or Drug-Syndrome Interactions That May Exacerbate the Disease or Syndrome',
    shortName: 'Disease Interactions',
    identifier: 'DiseaseGuidance',
    tableIcon: 'heart-ekg',
    description: 'Drugs that should be avoided in patients with specific diseases.',
  },
  {
    tableNumber: TableCategories.Caution,
    fullTitle: 'Drugs To Be Used With Caution in Older Adults',
    shortName: 'Use with Caution',
    identifier: 'Caution',
  },
  {
    tableNumber: TableCategories.DrugInteractions,
    fullTitle:
      'Potentially Clinically Important Drug-Drug Interactions That Should Be Avoided in Older Adults',
    shortName: 'Drug Interactions',
    identifier: 'DrugInteractions',
    tableIcon: 'capsule',
    description:
      'Drug interactions that arise in patients over the age of 65. Drug interactions applicable to the general population are not included in this table.',
  },
  {
    tableNumber: TableCategories.RenalEffect,
    fullTitle:
      'Medications That Should Be Avoided or Have Their Dosage Reduced With Varying Levels of Kidney Function in Older Adults',
    shortName: 'Renal Interactions',
    identifier: 'Clearance',
    tableIcon: 'kidneys',
    description: 'Drugs that can be toxic in geriatric patients with reduced kidney function.',
  },
  {
    tableNumber: TableCategories.Anticholinergics,
    fullTitle: 'Drugs With Strong Anticholinergic Properties',
    shortName: 'Anticholinergics',
    identifier: 'Anticholinergics',
  },
];

export const TABLE_ATTRIBUTES = new InjectionToken<TableAttributes[]>('tables.attributes');
