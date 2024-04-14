-- Create 'forms' table
CREATE TABLE forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  formName VARCHAR(4000) NOT NULL,
  formDescription VARCHAR(4000) NOT NULL
);

-- Create 'form_fields' table
CREATE TABLE form_fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  formId UUID NOT NULL REFERENCES forms(id),
  label VARCHAR(4000) NOT NULL,
  type VARCHAR(255) NOT NULL,
  options VARCHAR(4000)[],
  required BOOLEAN NOT NULL
);
