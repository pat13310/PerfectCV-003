/*
  # Create experiences table and policies

  1. New Tables
    - `experiences`
      - `id` (uuid, primary key)
      - `cv_id` (uuid, foreign key to cvs)
      - `company` (text)
      - `position` (text) 
      - `start_date` (date)
      - `end_date` (date)
      - `description` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `experiences` table
    - Add policies for authenticated users to manage their experiences
    - Add foreign key constraint to cvs table
*/

-- Drop existing trigger if it exists
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'experiences_updated_at') THEN
    DROP TRIGGER experiences_updated_at ON experiences;
  END IF;
END $$;

-- Drop existing trigger function if it exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_experiences_updated_at') THEN
    DROP FUNCTION update_experiences_updated_at();
  END IF;
END $$;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can view their own experiences" ON experiences;
  DROP POLICY IF EXISTS "Users can create experiences for their CVs" ON experiences;
  DROP POLICY IF EXISTS "Users can update their own experiences" ON experiences;
  DROP POLICY IF EXISTS "Users can delete their own experiences" ON experiences;
END $$;

-- Create experiences table if it doesn't exist
CREATE TABLE IF NOT EXISTS experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cv_id uuid REFERENCES cvs(id) ON DELETE CASCADE,
  company text NOT NULL,
  position text NOT NULL,
  start_date date,
  end_date date,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own experiences"
  ON experiences
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cvs
      WHERE cvs.id = experiences.cv_id
      AND cvs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create experiences for their CVs"
  ON experiences
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM cvs
      WHERE cvs.id = cv_id
      AND cvs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own experiences"
  ON experiences
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cvs
      WHERE cvs.id = experiences.cv_id
      AND cvs.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM cvs
      WHERE cvs.id = experiences.cv_id
      AND cvs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own experiences"
  ON experiences
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cvs
      WHERE cvs.id = experiences.cv_id
      AND cvs.user_id = auth.uid()
    )
  );

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_experiences_cv_id ON experiences(cv_id);

-- Create trigger function for updating updated_at
CREATE OR REPLACE FUNCTION update_experiences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER experiences_updated_at
  BEFORE UPDATE ON experiences
  FOR EACH ROW
  EXECUTE FUNCTION update_experiences_updated_at();