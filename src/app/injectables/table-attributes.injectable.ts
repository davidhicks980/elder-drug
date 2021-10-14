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
    description:
      'The Disease Guidance table contains drugs that should be avoided in those with a specific disease.',
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
      'The Drug Interactions table contains concerning drug interactions specific to those over the age of 65. It does not include all drug interactions.',
  },
  {
    tableNumber: TableCategories.RenalEffect,
    fullTitle:
      'Medications That Should Be Avoided or Have Their Dosage Reduced With Varying Levels of Kidney Function in Older Adults',
    shortName: 'Renal Interactions',
    identifier: 'Clearance',
    tableIcon: 'kidneys',
    description:
      'The Renal Interactions table contains drugs that can be toxic in geriatric patients with reduced kidney function.',
  },
  {
    tableNumber: TableCategories.Anticholinergics,
    fullTitle: 'Drugs With Strong Anticholinergic Properties',
    shortName: 'Anticholinergics',
    identifier: 'Anticholinergics',
  },
];

export const TABLE_ATTRIBUTES = new InjectionToken<TableAttributes[]>('tables.attributes');
