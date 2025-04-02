/*
  # Create admin user

  1. Changes
    - Create admin user with email admin@autopro.com
    - Set admin flag in user metadata
    - Create corresponding identity
*/

-- Create admin user through Supabase Auth
DO $$
DECLARE
  user_id uuid;
BEGIN
  -- Insert into auth.users
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@autopro.com',
    crypt('Autopro2023!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"is_admin":true}',
    now(),
    now(),
    '',
    '',
    '',
    ''
  ) RETURNING id INTO user_id;

  -- Insert into auth.identities
  INSERT INTO auth.identities (
    id,
    user_id,
    provider_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
  ) VALUES (
    user_id,
    user_id,
    'admin@autopro.com',
    format('{"sub":"%s","email":"%s"}', user_id::text, 'admin@autopro.com')::jsonb,
    'email',
    now(),
    now(),
    now()
  );
END $$;