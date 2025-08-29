-- Let's see what the current constraint is checking for
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'public.listings'::regclass
AND contype = 'c';
