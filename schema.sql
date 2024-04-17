-- start create tables

CREATE TABLE form_table (
  form_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_name VARCHAR(4000) NOT NULL UNIQUE,
  form_description VARCHAR(4000) NOT NULL
);

CREATE TABLE form_form_field_table (
  form_field_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id UUID NOT NULL REFERENCES form_table(form_id),
  label VARCHAR(4000) NOT NULL,
  type VARCHAR(255) NOT NULL,
  options VARCHAR(4000),
  required BOOLEAN NOT NULL
);

-- end create tables


-- Insert into form_table and form_field_table
CREATE
OR REPLACE FUNCTION greet (
  form_name VARCHAR(4000),
  form_description VARCHAR(4000),
  form_fields JSON
) 
RETURNS JSON AS $$
  var result = {};

    try {
        var form_insert_query = plv8.execute(
            'INSERT INTO form_table (form_name, form_description) VALUES (${form_name}, ${form_description}) RETURNING form_id',
            [form_name, form_description]
        );

        if (form_insert_query && form_insert_query.length > 0) {
            var form_id = formInsertQuery[0].form_id;

            form_fields.forEach(function(field) {
                var { label, type, options, required } = field;
                plv8.execute(
                    'INSERT INTO form_form_field_table (form_id, label, type, options, required) VALUES (${form_id}, ${label}, ${type}, ${options}, ${required})',
                    [form_id, label, type, options, required]
                );
            });

            result.success = true;
            result.message = 'Form data inserted successfully';
            result.formId = formId;
        } else {
            result.success = false;
            result.message = 'Failed to insert form data';
        }
    } catch (error) {
        result.success = false;
        result.message = error.message;
    }

    return result;
$$ LANGUAGE plv8;

