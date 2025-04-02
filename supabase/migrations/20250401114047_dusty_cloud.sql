/*
  # Create parameters table

  1. New Tables
    - `parameters`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `notifications_email` (boolean)
      - `notifications_updates` (boolean)
      - `language` (text)
      - `theme` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS
    - Add policies for authenticated users to manage their own parameters
*/

-- Create parameters table
CREATE TABLE IF NOT EXISTS parameters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  notifications_email boolean DEFAULT true,
  notifications_updates boolean DEFAULT true,
  language text DEFAULT 'fr',
  theme text DEFAULT 'light',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE parameters ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own parameters"
  ON parameters
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own parameters"
  ON parameters
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own parameters"
  ON parameters
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create trigger function
CREATE OR REPLACE FUNCTION update_parameters_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER parameters_updated_at
  BEFORE UPDATE ON parameters
  FOR EACH ROW
  EXECUTE FUNCTION update_parameters_updated_at();