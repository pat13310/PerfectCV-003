/*
  # Fix experiences table RLS policies

  1. Changes
    - Drop existing policies and triggers to avoid conflicts
    - Create new RLS policies with proper checks
    - Ensure proper CV ownership validation
    - Add proper indexes and triggers

  2. Security
    - Enable RLS on experiences table
    - Add policies for CRUD operations
    - Validate CV ownership in all policies
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own experiences" ON experiences;
DROP POLICY IF EXISTS "Users can create experiences for their CVs" ON experiences;
DROP POLICY IF EXISTS "Users can update their own experiences" ON experiences;
DROP POLICY IF EXISTS "Users can delete their own experiences" ON experiences;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS experiences_updated_at ON experiences;
DROP TRIGGER IF EXISTS update_experiences_updated_at ON experiences;

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS update_experiences_updated_at();

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

-- Enable RLS
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;

-- Create new policies with proper checks
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

CREATE POLICY "Users can insert experiences for their CVs"
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

CREATE POLICY "Users can modify their own experiences"
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

CREATE POLICY "Users can remove their own experiences"
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

-- Ensure index exists for performance
CREATE INDEX IF NOT EXISTS idx_experiences_cv_id ON experiences(cv_id);