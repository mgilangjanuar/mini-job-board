-- Create nanoid function
CREATE OR REPLACE FUNCTION nanoid(
    size int DEFAULT 21,
    alphabet text DEFAULT '_-0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
    additionalBytesFactor float DEFAULT 1.6
) RETURNS text
LANGUAGE plpgsql
VOLATILE
AS $$
DECLARE
    alphabetArray text[];
    alphabetLength int := 64; -- Default length if not specified or derived
    mask int := 63; -- Default mask if not specified or derived
    step int := 34; -- Default step if not specified or derived
BEGIN
    IF size IS NULL OR size < 1 THEN
        RAISE EXCEPTION 'The size must be defined and greater than 0!';
    END IF;

    IF alphabet IS NULL OR length(alphabet) = 0 OR length(alphabet) > 255 THEN
        RAISE EXCEPTION 'The alphabet must be defined and contain between 1 and 255 symbols!';
    END IF;

    -- (Additional logic to calculate alphabetLength, mask, and step based on the provided alphabet)
    -- This part can be more complex, involving bit manipulation to find optimal values.
    -- For a basic implementation, you might use a simplified version or a pre-calculated one.

    RETURN substr(
        (SELECT string_agg(
            substr(alphabet, (floor(random() * alphabetLength) + 1)::int, 1),
            ''
        ) FROM generate_series(1, size)),
        1, size
    );
END;
$$;

create table jobs (
    id text primary key default nanoid(),
    title text not null,
    company_name text not null,
    company_website text,
    location text,
    description text not null,
    user_id uuid references auth.users(id) on delete cascade,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
