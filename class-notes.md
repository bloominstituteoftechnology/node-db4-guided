## Luis' opinion ##

-- A Good Data Model --
-captures all the data needed by the system
-captures only the data needed by the system
-reflects reality from the POV of the system
-evolves with the needs of the system
-guarantees data integrity (without sacrificing too much performance)
-is driven by way we access the data

-- Components --
-entities (resources): nouns --> tables
-properties (columns, fields, attributes) --> colum ns
-relationships between entitites --> foreign keys

-- Workflow --
-identify the entities (resoures): nouns --> tables
-identify the relationships --> foreign keys
-identify properties (columns, fields, attributes) --> columns

-- Relationships --
-one-to-one: rare
-one-to-many: the most common type
-many-to-many: smoke and mirrors! A TRICK!

-- Mantras de Luis --
-Every table must have a primary key
-