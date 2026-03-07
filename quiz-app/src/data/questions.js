export const questions = [
  {
    text: "Is the SAP system's change log (audit trail) activated for all key financial and accounting modules (FI, CO, MM, SD) at both Application & DB level?",
    category: "Configuration",
    options: [
      { text: "Yes", value: "yes" },
      { text: "No", value: "no" },
    ],
  },
  {
    text: "Are SAP change logs configured to capture the user ID, timestamp, and type of modification for every financial transaction both at Application & DB level?",
    category: "Configuration",
    options: [
      { text: "Yes", value: "yes" },
      { text: "No", value: "no" },
    ],
  },
    {
    text: "Has your SAP Basis or IT team implemented appropriate access controls to prevent unauthorized changes to logging configurations?",
    category: "Configuration",
    options: [
      { text: "Yes", value: "yes" },
      { text: "No", value: "no" },
    ],
  },
  {
    text: "Have you implemented all the steps outlined in SAP Note 3042258 including DDL/DML Activities?",
    category: "SAP Standard Configuration",
    options: [
      { text: "Yes", value: "yes" },
      { text: "No", value: "no" },
    ],
  },
  {
    text: "Is the audit trail (change document history) in SAP protected from deletion or alteration by end users or administrators?",
    category: "Policies & Controls",
    options: [
      { text: "Yes", value: "yes" },
      { text: "No", value: "no" },
    ],
  },
  {
    text: "Are audit trail logs and change documents retained for at least eight (8) financial years? Do you have a process in-place?",
    category: "Policies & Controls",
    options: [
      { text: "Yes", value: "yes" },
      { text: "No", value: "no" },
    ],
  },
  {
    text: "Are old and new field values captured for all relevant data changes (e.g., vendor, customer, GL, cost center, asset master, PO, invoice) at database level?",
    category: "Policies & Controls",
    options: [
      { text: "Yes", value: "yes" },
      { text: "No", value: "no" },
    ],
  },
  {
    text: "Have all relevant configurations been verified to ensure that the audit trail feature at both application and DB levels cannot be turned off by users? Do you have proper notification mechanism (controls) established?",
    category: "Policies & Controls",
    options: [
      { text: "Yes", value: "yes" },
      { text: "No", value: "no" },
    ],
  },
  {
    text: "Have you implemented or validated tamper-evident controls to prevent manipulation of the audit trail data at database level?",
    category: "Policies & Controls",
    options: [
      { text: "Yes", value: "yes" },
      { text: "No", value: "no" },
    ],
  },
  {
    text: "Do you periodically review SAP audit logs and/or change documents (e.g., via transaction SCU3, CDHDR/CDPOS) as part of internal or external audits?",
    category: "Review",
    options: [
      { text: "Yes", value: "yes" },
      { text: "No", value: "no" },
    ],
  },
  {
    text: "If you are on SAP Cloud (Rise with SAP), are you taking Log backups periodically? Are you aware of the limitations of log availability in SAP Cloud systems?",
    category: "Validation",
    options: [
      { text: "Yes", value: "yes" },
      { text: "No", value: "no" },
    ],
  },
  {
    text: "Is backup and recovery configured to include SAP change log and database audit logs?",
    category: "Backup & Recovery",
    options: [
      { text: "Yes", value: "yes" },
      { text: "No", value: "no" },
    ],
  },
  {
    text: "Have finance and SAP support teams received training on MCA Rule 11(g) and its audit trail implications in SAP?",
    category: "Training & Awareness",
    options: [
      { text: "Yes", value: "yes" },
      { text: "No", value: "no" },
    ],
  },
  {
    text: "Do you have a report that enables finance or audit teams to view database audit trail data?",
    category: "Reporting",
    options: [
      { text: "Yes", value: "yes" },
      { text: "No", value: "no" },
    ],
  },
  {
    text: "Have you aligned with your financial auditor on MCA requirements?",
    category: "Auditor Alignment",
    options: [
      { text: "Yes", value: "yes" },
      { text: "No", value: "no" },
    ],
  },
];
