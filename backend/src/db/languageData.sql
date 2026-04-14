INSERT INTO languages (name) VALUES
    ('Finnish'),
    ('English')
    ON CONFLICT DO NOTHING;
