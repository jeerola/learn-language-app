INSERT INTO languages (name, code) VALUES
    ('Finnish', 'fi'),
    ('English', 'en')
    ON CONFLICT DO NOTHING;
