/*
  # Create skills table and policies

  1. New Tables
    - `skills`
      - `id` (uuid, primary key)
      - `cv_id` (uuid, foreign key to cvs)
      - `name` (text)
      - `level` (integer, 1-5)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `skills` table
    - Add policies for authenticated users to manage their skills
    - Add foreign key constraint to cvs table
*/

-- Drop existing trigger and function if they exist
DROP TRIGGER IF EXISTS update_skills_updated_at ON skills;
DROP FUNCTION IF EXISTS update_skills_updated_at();

-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cv_id uuid REFERENCES cvs(id) ON DELETE CASCADE,
  name text NOT NULL,
  level integer CHECK (level >= 1 AND level <= 5),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own skills"
  ON skills
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cvs
      WHERE cvs.id = skills.cv_id
      AND cvs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create skills for their CVs"
  ON skills
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM cvs
      WHERE cvs.id = cv_id
      AND cvs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own skills"
  ON skills
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cvs
      WHERE cvs.id = skills.cv_id
      AND cvs.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM cvs
      WHERE cvs.id = skills.cv_id
      AND cvs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own skills"
  ON skills
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cvs
      WHERE cvs.id = skills.cv_id
      AND cvs.user_id = auth.uid()
    )
  );

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_skills_cv_id ON skills(cv_id);

-- Create trigger function for updating updated_at
CREATE OR REPLACE FUNCTION update_skills_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_skills_updated_at
  BEFORE UPDATE ON skills
  FOR EACH ROW
  EXECUTE FUNCTION update_skills_updated_at();