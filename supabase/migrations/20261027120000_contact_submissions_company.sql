/*
# Add company to contact_submissions

The merged contact form (Bolt + LogicFlow) asks for an optional company name.
*/

ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS company text;
